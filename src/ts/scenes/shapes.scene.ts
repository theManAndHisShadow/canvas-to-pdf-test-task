import { getColor } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createShapeseScene = function (params: { centerPoint: { x: number, y: number }, width: number, height: number, background: string }) {
    const center = params.centerPoint;
    const sceneContainer = new PIXI.Container();

    // добавляем подложку-фон для сцены и сразу интегрируем её в структуру сцены
    const sceneContainerBackground = PIXI_Wrapper.createRectangle({
        label: 'scene_background',
        x: 0,
        y: 0,
        width: params.width,
        height: params.height,
        fillColor: params.background,
    });

    sceneContainer.addChild(sceneContainerBackground);
    // Размеры области и её центра
    const areaWidth = 360;
    const areaHeight = 360;
    const areaCenter = { x: areaWidth / 2, y: areaHeight / 2 };

    // Радиус круга, сторона квадрата, длина стороны треугольника и радиус звезды
    const figureSize = 80; // Базовый размер для всех фигур

    let offsetX = 50;
    let offsetY = 50;

    // Круг (верхняя левая четверть)
    const circle_1 = PIXI_Wrapper.createCircle({
        label: 'circle_1',
        cx: (areaCenter.x - areaWidth / 4) + offsetX,
        cy: (areaCenter.y - areaHeight / 4) + offsetY,
        radius: figureSize,
        fillColor: getColor('darkRed'),
        borderThickness: 3,
        borderColor: getColor('brightRed'),
    });

    // Треугольник (верхняя правая четверть)
    const triangle_1 = PIXI_Wrapper.createEquilateralTriangle({
        label: 'triangle_1',
        cx: (areaCenter.x + areaWidth / 4) + offsetX,
        cy: (areaCenter.y - areaHeight / 4) + offsetY,
        sideLength: figureSize * 2,
        fillColor: getColor('darkGreen'),
        borderThickness: 3,
        borderColor: getColor('brightGreen'),
    });

    // Квадрат (нижняя левая четверть)
    const square_1 = PIXI_Wrapper.createRectangle({
        label: 'square_1',
        x: (areaCenter.x - areaWidth / 4 - figureSize) + offsetX,
        y: (areaCenter.y + areaHeight / 4 - figureSize) + offsetY,
        width: figureSize * 2,
        height: figureSize * 2,
        fillColor: getColor('darkBlue'),
        borderThickness: 3,
        borderColor: getColor('brightBlue'),
    });

    // Звезда (нижняя правая четверть)
    const star_1 = PIXI_Wrapper.createStar({
        label: 'star_1',
        cx: (areaCenter.x + areaWidth / 4) + offsetX,
        cy: (areaCenter.y + areaHeight / 4) + offsetY,
        spikes: 5,
        radius: figureSize * 1.2,
        fillColor: getColor('darkYellow'),
        borderThickness: 3,
        borderColor: getColor('brightYellow'),
        angle: -25,
    });

    let spiral_1 = PIXI_Wrapper.createSpiral({
        label: 'spiral_1',
        cx: center.x,
        cy: center.y,
        lineColor: getColor('lightCarbon'),
        fillColor: getColor('carbon'),
        spacing: 10,
        radius: 200,
        lineThickness: 5,
    });

    // Добавляем фигуры в контейнер
    sceneContainer.addChild(spiral_1);
    sceneContainer.addChild(circle_1);
    sceneContainer.addChild(triangle_1);
    sceneContainer.addChild(square_1);
    sceneContainer.addChild(star_1);

    return sceneContainer;
}


export default createShapeseScene;