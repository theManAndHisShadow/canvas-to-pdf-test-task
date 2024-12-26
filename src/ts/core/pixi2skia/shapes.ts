import * as PIXI from "pixi.js-legacy";
import { Canvas, CanvasKit } from "canvaskit-wasm";
import { decimal2RGBA } from "../../helpers";

export function drawRectangle(canvas: Canvas, rect: PIXI.Rectangle, styles: any, canvasKit: CanvasKit) {
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

export function drawCircle(canvas: Canvas, circle: PIXI.Circle, styles: any, canvasKit: CanvasKit) {
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


export function drawPolygon(canvas: Canvas, points: number[], styles: any, canvasKit: CanvasKit) {
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