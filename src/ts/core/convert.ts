import { getColor, decimal2RGBA, radians2degrees } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import { Canvas, CanvasKit, Path } from "canvaskit-wasm";

function applyTransformationsToSkia(graphics: PIXI.Graphics, canvas: Canvas, canvasKit: CanvasKit) {
    const transform = graphics.transform;

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

    // N.B: Пока работы со скосом не будет
    // canvas.concat(skewMatrix);
}

function drawRectangle(canvas: Canvas, rect: PIXI.Rectangle, styles: any, canvasKit: CanvasKit) {
    const { x, y, width, height } = rect;

    const path = new canvasKit.Path();
    path.moveTo(x, y);
    path.lineTo(x + width, y);
    path.lineTo(x + width, y + height);
    path.lineTo(x, y + height);
    path.close();

    const fillPaint = new canvasKit.Paint();
    fillPaint.setStyle(canvasKit.PaintStyle.Fill);
    fillPaint.setAntiAlias(true);
    fillPaint.setColor(canvasKit.Color(...decimal2RGBA(styles.fillColor)));

    const strokePaint = new canvasKit.Paint();
    strokePaint.setStyle(canvasKit.PaintStyle.Stroke);
    strokePaint.setAntiAlias(true);
    strokePaint.setColor(canvasKit.Color(...decimal2RGBA(styles.lineColor)));
    strokePaint.setStrokeWidth(styles.lineWidth);

    // Рисуем заливку
    canvas.drawPath(path, fillPaint);

    // Рисуем обводку
    if (styles.lineWidth > 0) {
        canvas.drawPath(path, strokePaint);
    }
}

function drawCircle(canvas: Canvas, circle: PIXI.Circle, styles: any, canvasKit: CanvasKit) {
    const path = new canvasKit.Path();
    path.addCircle(circle.x, circle.y, circle.radius);

    const fillPaint = new canvasKit.Paint();
    fillPaint.setStyle(canvasKit.PaintStyle.Fill);
    fillPaint.setAntiAlias(true);
    fillPaint.setColor(canvasKit.Color(...decimal2RGBA(styles.fillColor)));

    const strokePaint = new canvasKit.Paint();
    strokePaint.setStyle(canvasKit.PaintStyle.Stroke);
    strokePaint.setAntiAlias(true);
    strokePaint.setColor(canvasKit.Color(...decimal2RGBA(styles.lineColor)));
    strokePaint.setStrokeWidth(styles.lineWidth);

    // Рисуем заливку
    canvas.drawPath(path, fillPaint);

    // Рисуем обводку
    if (styles.lineWidth > 0) {
        canvas.drawPath(path, strokePaint);
    }
}


function drawPolygon(canvas: Canvas, points: number[], styles: any, canvasKit: CanvasKit) {
    const fillPaint = new canvasKit.Paint();
    fillPaint.setStyle(canvasKit.PaintStyle.Fill);
    fillPaint.setAntiAlias(true);
    fillPaint.setColor(canvasKit.Color(...decimal2RGBA(styles.fillColor)));

    const path = new canvasKit.Path();
    path.moveTo(points[0], points[1]);

    for (let i = 2; i < points.length; i += 2) {
        path.lineTo(points[i], points[i + 1]);
    }
    path.close();

    // Рисуем заливку
    canvas.drawPath(path, fillPaint);

    // Рисуем обводку
    if(styles.lineWidth > 0) {
        const strokePaint = new canvasKit.Paint();
        strokePaint.setStyle(canvasKit.PaintStyle.Stroke);
        strokePaint.setAntiAlias(true);
        strokePaint.setColor(canvasKit.Color(...decimal2RGBA(styles.lineColor)));
        strokePaint.setStrokeWidth(styles.lineWidth);
        
        canvas.drawPath(path, strokePaint);
    }
}

function renderGraphics(graphics: PIXI.Graphics, canvas: Canvas, canvasKit: CanvasKit) {
    canvas.save();
    applyTransformationsToSkia(graphics, canvas, canvasKit);

    const data = extractGraphicsData(graphics);

    // console.log(data);

    data.forEach(item => {
        const { type, shape, styles } = item;

        if (type === PIXI.SHAPES.RECT) {
            // console.log('Rect');
            drawRectangle(canvas, shape as PIXI.Rectangle, styles, canvasKit);
        } else if (type === PIXI.SHAPES.CIRC) {
            // console.log('Circle');
            drawCircle(canvas, shape as PIXI.Circle, styles, canvasKit);
        } else if (type === PIXI.SHAPES.POLY) {
            // console.log('Poly');
            drawPolygon(canvas, (shape as PIXI.Polygon).points, styles, canvasKit);
        } else {
            console.warn('Unsupported shape type:', type);
        }
    });
    canvas.restore();
}

function renderContainer(container: PIXI.Container, canvas: Canvas, canvasKit: CanvasKit) {
    container.children.forEach((containerItem) => {
        // Обработка различных типов объектов
        if (containerItem instanceof PIXI.Sprite) {
            // console.log('Sprite', containerItem);
            // renderSprite(containerItem, canvas, canvasKit);
        } else if (containerItem instanceof PIXI.Graphics) {
            // Побочные эффекты - при отсутсвии данного вызова прцоес отрисовки вываливается в ошибку canvaskit.wasm:0x3962a Uncaught (in promise) RuntimeError: table index is out of bounds
            renderGraphics(containerItem, canvas, canvasKit);
        } else if (containerItem instanceof PIXI.Container) {
            // console.log('Container', containerItem);
            renderContainer(containerItem, canvas, canvasKit);
        } else {
            console.log('unknown type', containerItem);
        }
    });
}

function imageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    context.drawImage(image, 0, 0);
    return canvas;
}

function canvasToUint8Array(canvas: HTMLCanvasElement): Uint8Array {
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return array;
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    // Преобразуем Uint8Array в строку
    const binaryString = Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('');
    // Кодируем строку в Base64
    return btoa(binaryString);
}

function renderSprite(sprite: PIXI.Sprite, canvas: Canvas, canvasKit: CanvasKit) {
    // Получаем базовую текстуру спрайта
    const baseTexture = sprite.texture.baseTexture;

    // Проверяем, что текстура загружена
    if (!baseTexture.resource) {
        throw new Error('Base texture resource is not available');
    }

    baseTexture.resource.load().then((loadedImage) => {
        const image = (loadedImage as PIXI.ImageResource).source as HTMLImageElement;
    
        // Преобразуем HTMLImageElement -> Canvas -> Uint8Array
        const tempCanvas = imageToCanvas(image);
        const uint8Array = canvasToUint8Array(tempCanvas);
        const base64 = uint8ArrayToBase64(uint8Array);
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
    
        // Создаем SkImage
        const skImage = canvasKit.MakeImageFromEncoded(uint8Array);
        if (!skImage) {
            throw new Error('Failed to create SkImage');
        }
    
        console.log('SkImage successfully created:', skImage);
        console.log('data:image/png;base64,' + base64);
        console.log(url);

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
        canvas.drawImage(skImage, 0, 0, paint);
    });
};

function extractGraphicsData(graphics: PIXI.Graphics) {
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
            styles: { fillColor, lineColor, lineWidth },
        };
    });
}


export default async function convertPixiContainerToSkia(params: { from: PIXI.Container, to: HTMLCanvasElement, use: CanvasKit}) {
    let canvasKit = params.use;

    // Code goes here using CanvasKit
    const surface = canvasKit.MakeCanvasSurface(params.to);

    const paint = new canvasKit.Paint();
    paint.setAntiAlias(true);

    surface.drawOnce(canvas => {
        canvas.clear(canvasKit.parseColorString(getColor('carbon')));
        renderContainer(params.from, canvas, canvasKit);
    });

    paint.delete();
}