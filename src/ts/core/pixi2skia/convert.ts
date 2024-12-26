import { debugLog, getColor, radians2degrees, imageToCanvas, canvasToUint8Array, uint8ArrayToBase64 } from "../../helpers";
import * as PIXI from "pixi.js-legacy";
import { Canvas, CanvasKit, Path } from "canvaskit-wasm";
import { drawCircle, drawPolygon, drawRectangle } from "./shapes";



/**
 * Применяет трансформации из PIXI для фигур SKIA
 * @param graphics - экземпляр графики PIXI
 * @param canvas - ссылка на объект холста
 */
function _applyPixiTransformationsToSkia(graphics: PIXI.Graphics, canvas: Canvas) {
    // Извлекаем все трансформации из PIXI
    const transform = graphics.transform;

    // Далее вручную переносим все важные виды трансформации
    // Применяем позицию (перемещение)
    canvas.translate(transform.position.x, transform.position.y);

    // Применяем точку опоры (pivot)
    canvas.translate(-transform.pivot.x * transform.scale.x, -transform.pivot.y * transform.scale.y);

    // подготавливаем координаты для точки поворота
    const rx = transform.pivot.x * transform.scale.x;
    const ry = transform.pivot.y * transform.scale.y;        

    // Применяем поворот (в радианах)
    canvas.rotate(radians2degrees(transform.rotation), rx, ry);

    // Применяем масштабирование
    canvas.scale(transform.scale.x, transform.scale.y);

    // N.B: Пока работы со скосом  (scew) не будет
    // canvas.concat(skewMatrix);
}



/**
 * Извлекает важные данные из объекта PIXI графики
 * @param graphics  объект графики PIXI
 * @returns 
 */
function _extractPixiGraphicsData(graphics: PIXI.Graphics) {
    const data = graphics.geometry.graphicsData;

    return data.map(item => {
        const { type, shape, fillStyle, lineStyle } = item;

        // Общая информация о стиле
        const fillColor = fillStyle?.color ?? 0x000000;
        const lineColor = lineStyle?.color ?? 0x000000;
        const lineWidth = lineStyle?.width ?? 0;

        return {
            type,
            shape,
            style: { fillColor, lineColor, lineWidth },
        };
    });
}



/**
 * Отрисовывает графику из PIXI внутри холста SKIA
 * @param graphics - экземпляр графики PIXI
 * @param canvas - ссылка на объект холста
 * @param canvasKit - ссылка на объект модуля canvaskit
 */
function _renderPixiGraphics(graphics: PIXI.Graphics, canvas: Canvas, canvasKit: CanvasKit) {
    // сохраняем  состояние всего холста, чтобы каждый раз трансформации и стили одной отрисовки графики
    // не влияли на отрисовку других обхектов графики
    canvas.save();
    
    // переносим трансформации из PIXI в SKIA
    _applyPixiTransformationsToSkia(graphics, canvas);

    // достаёьм важные данные графики PIXI
    const data = _extractPixiGraphicsData(graphics);
    
    // и по данным отрисовываем фигуры уже в SKIA
    data.forEach(item => {
        const { type, shape, style } = item;

        // В завиисмости от формы графики рисуем фигуру в SKIA
        if (type === PIXI.SHAPES.RECT) {
            drawRectangle(canvas, shape as PIXI.Rectangle, style, canvasKit);
        } else if (type === PIXI.SHAPES.CIRC) {
            drawCircle(canvas, shape as PIXI.Circle, style, canvasKit);
        } else if (type === PIXI.SHAPES.POLY) {
            drawPolygon(canvas, (shape as PIXI.Polygon).points, style, canvasKit);
        } else {
            debugLog('warn', 'Unsupported shape type');
            console.log('shape', type, shape);
        }
    });

    // после всех манипуляция возвращаем исходное состояние холста
    canvas.restore();
}



/**
 * Отрисовывает контейнер PIXI внутри SKIA
 * @param container - ссылка на PIXI.Container
 * @param canvas - ссылка на холст SKIA
 * @param canvasKit - ссылка на объект модуля canvaskit
 */
function _renderPixiContainer(container: PIXI.Container, canvas: Canvas, canvasKit: CanvasKit) {
    // Проходлимся по всем вложенным элементам контейнера
    container.children.forEach((containerItem) => {
        // Так как цепочка наследования приходит по итогу к PIXI.Container,
        // То логику проверки принадлежности к классу нужно строить таким образом,
        // чтобы менее спецефичный класс стоял выше, а более общий - ниже по цепочке проверок
        if (containerItem instanceof PIXI.Sprite) {
            // N.B: Пока что зесь возникают проблемы с отрисовкой
            // Поэтому я временно отключил отрисовку cпрайтов
            // renderSprite(containerItem, canvas, canvasKit);
        } else if (containerItem instanceof PIXI.Graphics) {
            _renderPixiGraphics(containerItem, canvas, canvasKit);
        } else if (containerItem instanceof PIXI.Container) {
            _renderPixiContainer(containerItem, canvas, canvasKit);
        } else {
            debugLog('warn', 'unknow type');
            console.log(containerItem);
        }
    });
}



/**
 * Отрисовывает спрайт из PIXI внутри SKIA
 * @param sprite 
 * @param canvas 
 * @param canvasKit 
 */
function _renderPixiSprite(sprite: PIXI.Sprite, canvas: Canvas, canvasKit: CanvasKit) {
    // Получаем базовую текстуру спрайта
    const baseTexture = sprite.texture.baseTexture;

    // Проверяем, что текстура загружена
    if (!baseTexture.resource) {
        throw new Error('Base texture resource is not available');
    }

    // Далее важно чтобы ресурс текстуры был загружен
    // Поэтому через промист ожидаем когда он будет готов к работе
    baseTexture.resource.load().then((loadedImage) => {
        // Тут соглашаемся что загруженная картинка это именно HTML картинка
        const image = (loadedImage as PIXI.ImageResource).source as HTMLImageElement;
    
        // Так как важный метод из SKIA работает с Uint8Arra, то
        // преобразуем с помозью функий хлеперов загруженную картинку по цепочке:
        //  Процесс загрузки -> HTMLImageElement 
        //  HTMLImageElement -> Canvas 
        //  Canvas -> Uint8Array 
        const tempCanvas = imageToCanvas(image);
        const uint8Array = canvasToUint8Array(tempCanvas);
        
        // Создаем объект картинки SKIA
        const skiaImage = canvasKit.MakeImageFromEncoded(uint8Array);
        if (!skiaImage) {
            throw new Error('Failed to create SkImage');
        }
        
        // Отладочный блок кода
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const base64 = uint8ArrayToBase64(uint8Array);
        console.log('Skia image successfully created:', skiaImage);
        console.log('data:image/png;base64,' + base64);
        console.log(url);

        // Немного подготовки
        const width = sprite.width;
        const height = sprite.height;
        const paint = new canvasKit.Paint();
        paint.setAntiAlias(true);  // Включаем антиалиасинг

        // Создаем исходный прямоугольник (src)
        const sourceFrame = canvasKit.XYWHRect(0, 0, width, height);
        // Создаем целевой прямоугольник (dest)
        const targetFrame = canvasKit.XYWHRect(0, 0, width, height);

        console.log("Source frame:", sourceFrame);
        console.log("Target frame:", targetFrame);


        // Отрисовываем изображение на канвасе
        // canvas.drawImageRect(skImage, sourceFrame, targetFrame, paint);
        canvas.drawImage(skiaImage, 0, 0, paint);
    });
};



/**
 * Конвертирует контейнер из PIXI.js в холст SKIA
 * @param params.from - Объект контейнера, который нужно перенести в SKIA
 * @param params.to - На каком холсте отрисовать данные из SKIA
 * @param params.use - ссылка на готовый к работе объект модуля canvaskit
 */
export default async function pixi2skia(params: { from: PIXI.Container, to: HTMLCanvasElement, use: CanvasKit}) {
    let canvasKit = params.use;

    // Создаём некоторые важные объекты из canvaskit
    const surface = canvasKit.MakeCanvasSurface(params.to);
    const paint = new canvasKit.Paint();
    paint.setAntiAlias(true);

    // Процесс отрисовки 
    surface.drawOnce(canvas => {
        // Очищаем весь холст
        canvas.clear(canvasKit.parseColorString(getColor('carbon')));

        // Отрисовываем корневой контейнер из Pixi
        // Далее функция сама отрисоует всё содержимрое контейнера
        _renderPixiContainer(params.from, canvas, canvasKit);
    });

    // очищаем ресурсы
    paint.delete();
}