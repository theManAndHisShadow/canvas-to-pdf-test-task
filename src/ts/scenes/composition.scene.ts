import { getColor } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createCompositionScene = function(params: {centerPoint: {x: number, y: number}, width: number, height: number, background: string}){
    const center = params.centerPoint;
    const sceneContainer = new PIXI.Container();

    const outerSquareWidth = 360;
    const catetWidth = 90;
    const radius = catetWidth / 2;

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

    const background = PIXI_Wrapper.createRectangle({
        label: 'composition_background',
        x: center.x - (outerSquareWidth / 2), 
        y: center.y - (outerSquareWidth / 2), 
        width: outerSquareWidth, 
        height: outerSquareWidth,
        fillColor: getColor('brightSilver')
    });

    const triangle_1 = PIXI_Wrapper.createRightTriangle({
        label: 'triangle_1',
        cx: center.x - (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2),
        catet1: catetWidth, 
        catet2: catetWidth, 
        fillColor: getColor('darkSilver'),
        angle: 90,
    });

    const triangle_2 = PIXI_Wrapper.createRightTriangle({
        label: 'triangle_2',
        cx: center.x - (outerSquareWidth / 2) + catetWidth,
        cy: center.y - (outerSquareWidth / 2) + catetWidth,
        catet1: catetWidth,
        catet2: catetWidth,
        fillColor: getColor('lightCarbon'),
        angle: -90,
    });

    const big_Triangle_1 = PIXI_Wrapper.createRightTriangle({
        label: 'big_Triangle_1',
        cx: center.x - (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2) + (catetWidth * 3),
        catet1: catetWidth * 2,
        catet2: catetWidth * 2,
        fillColor: getColor('darkSilver'),
    });

    const big_Triangle_2 = PIXI_Wrapper.createRightTriangle({
        label: 'big_Triangle_2',
        cx: center.x + (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2),
        catet1: catetWidth * 2,
        catet2: catetWidth * 2,
        fillColor: getColor('darkSilver'),
        angle: 180,
    });

    const long_rect_1 = PIXI_Wrapper.createRectangle({
        label: 'long_rect_1',
        x: center.x - catetWidth, 
        y: center.y - catetWidth,
        width: catetWidth, 
        height: catetWidth * 3,
        fillColor: getColor('darkSilver'),
    });

    const triangle_3 = PIXI_Wrapper.createRightTriangle({
        label: 'triangle_3',
        cx: center.x, 
        cy: center.y + catetWidth,
        catet1: catetWidth * 1.4,
        catet2: catetWidth * 1.4,
        fillColor: getColor('lightCarbon'),
        angle: -135,
    });

    const square_1 = PIXI_Wrapper.createRectangle({
        label: 'square_1',
        x: center.x, 
        y: center.y,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('lightCarbon'),
    });

    const square_2 = PIXI_Wrapper.createRectangle({
        label: 'square_2',
        x: center.x + catetWidth, 
        y: center.y - catetWidth,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('brightSilver'),
    });

    const square_3 = PIXI_Wrapper.createRectangle({
        label: 'square_3',
        x: center.x + catetWidth, 
        y: center.y,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('darkSilver'),
    });

    const square_4 = PIXI_Wrapper.createRectangle({
        label: 'square_4',
        x: center.x + catetWidth, 
        y: center.y + catetWidth,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('lightCarbon'),
    });

    const semi_circle_1 = PIXI_Wrapper.createSemiCircle({
        label: 'semi_circle_1',
        cx: center.x + radius,
        cy: center.y - radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),

    });

    const semi_circle_2 = PIXI_Wrapper.createSemiCircle({
        label: 'semi_circle_2',
        cx: center.x + radius,
        cy: center.y + radius,
        radius: radius,
        fillColor: getColor('brightSilver'),
    });


    const semi_circle_3 = PIXI_Wrapper.createSemiCircle({
        label: 'semi_circle_3',
        cx: center.x + (radius * 3),
        cy: center.y + radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),
    });

    const semi_circle_4 = PIXI_Wrapper.createSemiCircle({
        label: 'semi_circle_4',
        cx: center.x + (radius * 3),
        cy: center.y + (radius * 3),
        radius: radius,
        fillColor: getColor('brightSilver'),
        angle: 90,
    });

    const circle_1 = PIXI_Wrapper.createCircle({
        label: 'circle_1',
        cx: center.x + (radius * 3),
        cy: center.y - radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),
    });

    const circle_2 = PIXI_Wrapper.createCircle({
        label: 'circle_2',
        cx: center.x + (radius * 3),
        cy: center.y - (radius * 3),
        radius: radius,
        fillColor: getColor('brightSilver'),
    });

    sceneContainer.addChild(background);
    sceneContainer.addChild(triangle_1);
    sceneContainer.addChild(triangle_2);
    sceneContainer.addChild(big_Triangle_1);
    sceneContainer.addChild(big_Triangle_2);
    sceneContainer.addChild(long_rect_1);
    sceneContainer.addChild(triangle_3);
    sceneContainer.addChild(square_1);
    sceneContainer.addChild(square_2);
    sceneContainer.addChild(square_3);
    sceneContainer.addChild(square_4);
    sceneContainer.addChild(semi_circle_1);
    sceneContainer.addChild(semi_circle_2);
    sceneContainer.addChild(semi_circle_3);
    sceneContainer.addChild(semi_circle_4);
    sceneContainer.addChild(circle_1);
    sceneContainer.addChild(circle_2);

    return sceneContainer;
}

export default createCompositionScene;