import { degrees2radians } from "../../helpers";

import "./patches/patched-classes";
import * as PIXI from "pixi.js-legacy";

/**
 * N.B: Здесь определены публичные и непуличные (названия с _) "функции-обёртки", 
 *      они не играют большой роли для всего проекта, но здоров упрщают создание
 *      более глобальныех структур (сцен, вложенных контейнеров).
 */

/**
 * Применяет поворот к графическому объекту
 * @param graphics - Графический объект, к которому применяется поворот
 * @param x - Координата X для центра поворота
 * @param y - Координата Y для центра поворота
 * @param angle - Угол поворота в градусах
 */
function _applyRotationTo(graphics: PIXI.Graphics, x: number, y: number, angle: number) {
    graphics.pivot.set(x, y);
    graphics.position.set(x, y);
    graphics.rotation = degrees2radians(angle);
}



/**
 * Применяет стиль (цвет заливки и обводки) к графическому объекту
 * @param graphics - Графический объект, к которому применяется стиль
 * @param fillColor - Цвет заливки (в формате строки, например, 'red' или '#FF0000')
 * @param borderThickness - Толщина обводки
 * @param borderColor - Цвет обводки (в формате строки, например, 'black' или '#000000')
 */
function _applyStyleTo(graphics: PIXI.Graphics, fillColor: string, borderThickness: number, borderColor: string) {
    if (borderThickness && borderThickness > 0) graphics.lineStyle(borderThickness, borderColor);
    if (fillColor) graphics.beginFill(fillColor);
}



/**
 * Создаёт графику для фигуры с заданными стилями и положением
 * @param label - Метка для графического объекта
 * @param x - Координата X центра фигуры
 * @param y - Координата Y центра фигуры
 * @param angle - Угол поворота фигуры в градусах
 * @param fillColor - Цвет заливки (в формате строки, например, 'red' или '#FF0000')
 * @param borderThickness - Толщина обводки
 * @param borderColor - Цвет обводки (в формате строки, например, 'black' или '#000000')
 * @returns - Графический объект с заданными параметрами
 */
function _createShapeGraphics(label: string, x: number, y: number, angle: number, fillColor: string, borderThickness: number, borderColor: string, isClosed: boolean): PIXI.Graphics {
    const shapeGraphics = new PIXI.Graphics();

    shapeGraphics.label = label;
    shapeGraphics.isClosed = isClosed;
    if (angle && angle !== 0) _applyRotationTo(shapeGraphics, x, y, angle);
    _applyStyleTo(shapeGraphics, fillColor, borderThickness, borderColor);

    return shapeGraphics;
}



/**
 * Создаёт прямоугольный графический объект
 * @param params.label - метка объекта
 * @param params.x - координата по оси X
 * @param params.y - координата по оси Y
 * @param params.width - ширина
 * @param params.height - высота
 * @param params.fillColor - цвет заливки прямоугольника
 * @param [params.borderThickness=0] - толщина границы прямоугольника
 * @param [params.borderColor=""] - цвет границы прямоугольника
 * @param [params.angle=0] - угол поворота прямоугольника
 * @returns - графический объект прямоугольника
 */
export function createRectangle(params: {
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, x, y, width, height, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const rectangleGraphics = _createShapeGraphics(label, x, y, angle, fillColor, borderThickness, borderColor, true);
    rectangleGraphics.drawRect(x, y, width, height);
    return rectangleGraphics;
}



/**
 * Создаёт полукруглый графический объект
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.radius - радиус полукруга
 * @param params.fillColor - цвет заливки полукруга
 * @param [params.borderThickness=0] - толщина границы полукруга
 * @param [params.borderColor=""] - цвет границы полукруга
 * @param [params.angle=0] - угол поворота полукруга
 * @returns - графический объект полукруга
 */
export function createSemiCircle(params: {
    label: string;
    cx: number;
    cy: number;
    radius: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, cx, cy, radius, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const semiCircleGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);

    const basicAngle = 90;
    const angleInRadians = degrees2radians(basicAngle);

    const startAngle = angleInRadians;
    const endAngle = angleInRadians + Math.PI;

    semiCircleGraphics.moveTo(cx, cy);
    semiCircleGraphics.arc(cx, cy, radius, startAngle, endAngle, false);
    semiCircleGraphics.lineTo(cx, cy);

    return semiCircleGraphics;
}



/**
 * Создаёт круглый графический объект
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.radius - радиус круга
 * @param params.fillColor - цвет заливки круга
 * @param [params.borderThickness=0] - толщина границы круга
 * @param [params.borderColor=""] - цвет границы круга
 * @param [params.angle=0] - угол поворота круга
 * @returns - графический объект круга
 */
export function createCircle(params: {
    label: string;
    cx: number;
    cy: number;
    radius: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, cx, cy, radius, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const circleGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);
    circleGraphics.drawCircle(cx, cy, radius);
    return circleGraphics;
}



/**
 * Создаёт треугольный графический объект
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.height - высота треугольника
 * @param params.baseWidth - ширина основания треугольника
 * @param params.fillColor - цвет заливки треугольника
 * @param [params.borderThickness=0] - толщина границы треугольника
 * @param [params.borderColor=""] - цвет границы треугольника
 * @param [params.angle=0] - угол поворота треугольника
 * @returns - графический объект треугольника
 */
export function createTriangle(params: {
    label: string;
    cx: number;
    cy: number;
    height: number;
    baseWidth: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, cx, cy, height, baseWidth, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const triangleGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);

    const topVertex = { x: cx, y: cy - height / 2 };
    const leftVertex = { x: cx - baseWidth / 2, y: cy + height / 2 };
    const rightVertex = { x: cx + baseWidth / 2, y: cy + height / 2 };

    triangleGraphics.drawPolygon([
        topVertex.x, topVertex.y,
        leftVertex.x, leftVertex.y,
        rightVertex.x, rightVertex.y,
    ]);

    return triangleGraphics;
}



/**
 * Создаёт равносторонний треугольный графический объект
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.sideLength - длина стороны треугольника
 * @param params.fillColor - цвет заливки треугольника
 * @param [params.borderThickness=0] - толщина границы треугольника
 * @param [params.borderColor=""] - цвет границы треугольника
 * @param [params.angle=0] - угол поворота треугольника
 * @returns - графический объект равностороннего треугольника
 */
export function createEquilateralTriangle(params: {
    label: string;
    cx: number;
    cy: number;
    sideLength: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, cx, cy, sideLength, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const equilateralTriangleGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);

    const height = (Math.sqrt(3) / 2) * sideLength;

    const topVertex = { x: cx, y: cy - height / 2 };
    const leftVertex = { x: cx - sideLength / 2, y: cy + height / 2 };
    const rightVertex = { x: cx + sideLength / 2, y: cy + height / 2 };

    equilateralTriangleGraphics.drawPolygon([
        topVertex.x, topVertex.y,
        leftVertex.x, leftVertex.y,
        rightVertex.x, rightVertex.y,
    ]);

    return equilateralTriangleGraphics;
}



/**
 * Создаёт прямоугольный графический объект
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.catet1 - длина первого катета прямоугольного треугольника
 * @param params.catet2 - длина второго катета прямоугольного треугольника
 * @param params.fillColor - цвет заливки треугольника
 * @param [params.borderThickness=0] - толщина границы треугольника
 * @param [params.borderColor=""] - цвет границы треугольника
 * @param [params.angle=0] - угол поворота треугольника
 * @returns - графический объект прямоугольного треугольника
 */
export function createRightTriangle(params: {
    label: string;
    cx: number;
    cy: number;
    catet1: number;
    catet2: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { label, cx, cy, catet1, catet2, fillColor, borderThickness = 0, borderColor = "", angle = 0 } = params;

    const rightTriangleGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);

    const rightAngleVertex = { x: cx, y: cy };
    const topVertex = { x: cx, y: cy - catet1 };
    const bottomRightVertex = { x: cx + catet2, y: cy };

    rightTriangleGraphics.drawPolygon([
        topVertex.x, topVertex.y,
        bottomRightVertex.x, bottomRightVertex.y,
        rightAngleVertex.x, rightAngleVertex.y,
    ]);

    return rightTriangleGraphics;
}


/**
 * Создаёт звезду с линиями в сцене PIXI.js
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.radius - радиус внешней звезды
 * @param params.spikes - количество лучей звезды
 * @param params.fillColor - цвет заливки звезды
 * @param [params.borderThickness=0] - толщина границы звезды
 * @param [params.borderColor=""] - цвет границы звезды
 * @param [params.angle=0] - угол поворота звезды
 * @returns - графический объект звезды
 */
export function createStar(params: {
    label: string;
    cx: number;
    cy: number;
    radius: number;
    spikes: number;
    fillColor: string;
    borderThickness?: number;
    borderColor?: string;
    angle?: number;
}): PIXI.Graphics {
    const { 
        label, 
        cx, 
        cy, 
        radius, 
        spikes, 
        fillColor, 
        borderThickness = 0, 
        borderColor = "", 
        angle = 0 
    } = params;

    // Создание графического объекта
    const starGraphics = _createShapeGraphics(label, cx, cy, angle, fillColor, borderThickness, borderColor, true);

    // Устанавливаем начальные параметры
    const step = Math.PI / spikes; // Угол между вершинами

    // Рисуем звезду
    for (let i = 0; i < 2 * spikes; i++) {
        const currentAngle = angle + i * step;
        const r = i % 2 === 0 ? radius : radius / 2; // Чередуем внешний и внутренний радиусы
        const x = cx + r * Math.cos(currentAngle);
        const y = cy + r * Math.sin(currentAngle);

        if (i === 0) {
            starGraphics.moveTo(x, y);
        } else {
            starGraphics.lineTo(x, y);
        }
    }

    // Закрываем фигуру
    starGraphics.closePath();

    return starGraphics;
}

/**
 * Создаёт спираль в сцене PIXI.js
 * @param params.label - метка объекта
 * @param params.cx - координата центра по оси X
 * @param params.cy - координата центра по оси Y
 * @param params.radius - итоговый радиус спирали
 * @param params.lineThickness - толщина линии спирали
 * @param params.spacing - расстояние между витками (толщина отступов)
 * @param params.lineColor - цвет линии спирали
 * @returns - графический объект спирали
 */
export function createSpiral(params: {
    label: string;
    cx: number;
    cy: number;
    radius: number;
    lineThickness: number;
    spacing: number;
    lineColor: string;
    fillColor: string;
}): PIXI.Graphics {
    const {
        label,
        cx,
        cy,
        radius,
        lineThickness,
        spacing,
        lineColor,
    } = params;

    // Создание графического объекта
    const spiralGraphics = new PIXI.Graphics();
    spiralGraphics.label = label;
    spiralGraphics.isClosed = false;

    spiralGraphics.beginFill(params.fillColor);

    // Устанавливаем стиль линии
    spiralGraphics.lineStyle(lineThickness, PIXI.utils.string2hex(lineColor));

    // Определяем количество витков
    const turns = Math.floor(radius / spacing);

    // Количество точек на один виток для плавности
    const pointsPerTurn = 100;
    const totalPoints = pointsPerTurn * turns;

    for (let i = 0; i <= totalPoints; i++) {
        // Угол текущей точки
        const angle = (i / pointsPerTurn) * 2 * Math.PI;

        // Текущий радиус с учётом отступов
        const currentRadius = (i / totalPoints) * radius;

        // Координаты точки
        const x = cx + currentRadius * Math.cos(angle);
        const y = cy + currentRadius * Math.sin(angle);

        if (i === 0) {
            spiralGraphics.moveTo(x, y);
        } else {
            spiralGraphics.lineTo(x, y);
        }
    }

    return spiralGraphics;
}




/**
 * Создаёт спрайт
 * @param x - координата позиции по оис икс
 * @param y - координата позиции по оси игрек
 * @param width - ширина спрайта
 * @param height - высота спрайта
 * @param src - путь к текстуре спрайта
 * @returns - спрайт
 */
export function createSprite(
    src: string,
    x: number, 
    y: number, 
    width: number, 
    height: number, 
): PIXI.Sprite {
    const spriteTexture = PIXI.Texture.from(src);
    const windowSprite = new PIXI.Sprite(spriteTexture);

    windowSprite.width = width;
    windowSprite.height = height;

    windowSprite.x = x;
    windowSprite.y = y;

    let splitted = src.split('/');
    windowSprite.label = splitted[splitted.length - 1];

    return windowSprite;
}