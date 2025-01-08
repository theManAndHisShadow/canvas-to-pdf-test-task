import { debugLog, getColor, radians2degrees, imageToCanvas, canvasToUint8Array, uint8ArrayToBase64 } from "../../helpers";
import * as PIXI from "pixi.js-legacy";
import { CanvasKit, Canvas, Rect, SkPicture, Image } from "../../../ts/libs/canvaskit-wasm/types";
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
            style: { fillColor, lineColor, lineWidth, isClosed: graphics.isClosed },
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
 * @param referanceToCache - ссылка не кэш текстур
 */
function _renderPixiContainer(container: PIXI.Container, canvas: Canvas, canvasKit: CanvasKit, textureCache: Map<string, Image>) {
    // Проходлимся по всем вложенным элементам контейнера
    container.children.forEach(containerItem => {
        // Так как цепочка наследования приходит по итогу к PIXI.Container,
        // То логику проверки принадлежности к классу нужно строить таким образом,
        // чтобы менее спецефичный класс стоял выше, а более общий - ниже по цепочке проверок
        if (containerItem instanceof PIXI.Sprite) {
            // N.B: Пока что зесь возникают проблемы с отрисовкой
            // Поэтому я временно отключил отрисовку cпрайтов
            _renderPixiSprite(containerItem, canvas, canvasKit, textureCache);
        } else if (containerItem instanceof PIXI.Graphics) {
            _renderPixiGraphics(containerItem, canvas, canvasKit);
        } else if (containerItem instanceof PIXI.Container) {
            _renderPixiContainer(containerItem, canvas, canvasKit, textureCache);
        } else {
            debugLog('warn', 'unknow type');
            console.log(containerItem);
        }
    });
}



/**
 * Отрисовывает спрайт из PIXI внутри SKIA
 * @param sprite - ссылка на PIXI.Sprite
 * @param canvas - ссылка на холст SKIA
 * @param canvasKit - ссылка на объект модуля canvaskit
 * @param referanceToCache - ссылка не кэш текстур
 */
function _renderPixiSprite(sprite: PIXI.Sprite, canvas: Canvas, canvasKit: CanvasKit, textureCache: Map<string, Image>) {
    // Получаем базовую текстуру спрайта
    const textureURL = sprite.texture.textureCacheIds[0];

    // Получаем готовый объект текстур из кэша текстур
    let texture = textureCache.get(textureURL);

    // отрисовываем текстуру по координатам спратай PIXI
    canvas.drawImage(texture, sprite.x, sprite.y, null);
};



/**
 * Предзагружает текстуры всего контейнера и возвращает структуру Map, которая хранить пару "url текстуры: SkImage"
 * @param rootContainer - контейнер, текстуры внутри которого нужно предзагрузить
 * @param canvasKit - ссылка на актуальный экземпляр CanvasKit
 * @returns готовый кеш текстур Map<string, Image>
 */
async function _preloadTextures(rootContainer: PIXI.Container, canvasKit: CanvasKit) {
    // Загружает текстуры по указанному url, сразу устанавливает размеры для текстуры через аргументы width и height
    const __loadTextureFrom = async (url: string, width: number, height: number) => {
        // Используя дефолтные методы загружаем картинку
        const response = await fetch(url);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob, {
            resizeWidth: width,
            resizeHeight: height,
        });

        // Создаём экземпляр SkImage
        const SkImage = canvasKit.MakeImageFromCanvasImageSource(bitmap);
    
        if (!SkImage) {
            throw new Error('Failed to create SkImage');
        }
    
        return SkImage;
    };

    // Ищет внутри контейнера все спрайты и загружает в кеш текстур уже в виде текстуры Skia
    const __parseTextures = async (container: PIXI.Container, referanceToCache: Map<string, Image>) => {
        for (const child of container.children) {
            // Если данный элемент контейнера - спрайт, то загружаем её текстур в кэш
            if (child instanceof PIXI.Sprite) {
                let url = child.texture.textureCacheIds[0];
                let texture = await __loadTextureFrom(url, child.width, child.height);
    
                referanceToCache.set(url, texture);
            } else if (child instanceof PIXI.Container) {
                // иначе рекурсивно парсим вложенный контейнер
                await __parseTextures(child, referanceToCache);
            }
        }
    
        return referanceToCache;
    };
    
    // Дожидаемся загрузки всех ресурсов
    let loadedTextures = await __parseTextures(rootContainer, new Map());

    // Возвращаем готовый кэш текстур
    return loadedTextures;
}



/**
 * Конвертирует контейнер из PIXI.js в холст SKIA
 * @param params.from - Объект контейнера, который нужно перенести в SKIA
 * @param params.to - На каком холсте отрисовать данные из SKIA
 * @param params.use - ссылка на готовый к работе объект модулntя canvaskit
 */
export default async function pixi2skia(params: { from: PIXI.Container, to: HTMLCanvasElement, use: CanvasKit, onComplete?: (data: any) => void}) {
    const canvasKit = params.use;
    const rootContainer = params.from;

    // Ввиду асинхронной природы загрузки текстур, нужно учесть нюанс 
    // связанный с временим жизни 'canvas' внутри сызова 'surface.drawOnce()'
    // Если пытаться отрисовать цеонтейнер с текстурой напрямую, то, 
    // пока загрузится картинка (а ведсь асинхронный вызов подгрузки не блокирует ренден),
    // canvas перестанет существовать, ведь дргуие окманды орисовки исполнятся 
    // и текущий сеанс отрисовки внутри 'drawOnce' будет завершён с удалением ссылок
    // Поэтому было решено сделать предзагрузку ресурсов, загруженные ресурсы будут храниться 
    // в данном кэше и будут доступны до начала сеанса отрисовки
    const textureCache = await _preloadTextures(rootContainer, canvasKit);

    // Создаём некоторые важные объекты из canvaskit
    const surface = canvasKit.MakeCanvasSurface(params.to);
    const paint = new canvasKit.Paint();
    paint.setAntiAlias(true);

    // Процесс отрисовки 
    surface.drawOnce((canvas: Canvas) => {
        // Получаем размеры холста
        const sizes = canvas.getSizes();

        // выделяем олатсь захвата
        let bounds: Rect = canvasKit.LTRBRect(0, 0, sizes.width, sizes.height);

        // Создаём объект, которы йбудет вести запись команд отрисовки
        let recorder = new canvasKit.PictureRecorder();

        // резльутат - объект записи
        let captureCanvas = recorder.beginRecording(bounds);

        // Отрисовываем корневой контейнер из Pixi
        // Далее функция сама отрисует всё содержимрое контейнера
        // в качестве цели, куда отрисовываем указываем видимый холст SkCanvas (canvas)
        // Так же важно передать ссылку на кэш текстур чтобы отрисовка текстур прроизошла корректно
        _renderPixiContainer(params.from, canvas, canvasKit, textureCache);

        // дублируем для захвата команд отрисовки Skia
        // Необходимо для конвертации SkCanvas в SkPDF
        // в качестве цели, куда отрисовать указываем специальный холст (captureCanvas) для захвата команд
         // Так же важно передать ссылку на кэш текстур чтобы отрисовка текстур прроизошла корректно
        _renderPixiContainer(params.from, captureCanvas, canvasKit, textureCache);

        debugLog('ok', 'pixi canvas successfully converted to skia canvas');

        // Получаем последовтальность кооманд и трансформаций
        let capture: SkPicture = recorder.finishRecordingAsPicture();

        // если запись создалась успешно и есть коллбек - вызываем коллбек и передаём данные по конвертации
        if (capture) {
            if(params.onComplete) {
                params.onComplete({
                    captured: capture,
                });
            }
        } else {    
            debugLog('err', '`capture` value is incorrect')
        }
    });

    // очищаем ресурсы
    paint.delete();
}