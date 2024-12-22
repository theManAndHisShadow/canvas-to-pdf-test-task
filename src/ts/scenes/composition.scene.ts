import { Container } from "pixi.js-legacy";
import { getColor } from "../helpers";
import { createRightTriangle, createRectangle, createCircle, createTriangle, createSemiCircle } from "../core/shapes";

const createCompositionScene = function(params: {centerPoint: {x: number, y: number}}){
    const center = params.centerPoint;
    const sceneContainer = new Container();

    const outerSquareWidth = 360;
    const catetWidth = 90;
    const radius = catetWidth / 2;

    const background = createRectangle({
        label: 'background',
        x: center.x - (outerSquareWidth / 2), 
        y: center.y - (outerSquareWidth / 2), 
        width: outerSquareWidth, 
        height: outerSquareWidth,
        fillColor: getColor('brightSilver')
    });

    const triangle_1 = createRightTriangle({
        label: 'triangle_1',
        cx: center.x - (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2),
        catet1: catetWidth, 
        catet2: catetWidth, 
        fillColor: getColor('darkSilver'),
        angle: 90,
    });

    const triangle_2 = createRightTriangle({
        label: 'triangle_2',
        cx: center.x - (outerSquareWidth / 2) + catetWidth,
        cy: center.y - (outerSquareWidth / 2) + catetWidth,
        catet1: catetWidth,
        catet2: catetWidth,
        fillColor: getColor('lightCarbon'),
        angle: -90,
    });

    const big_Triangle_1 = createRightTriangle({
        label: 'big_Triangle_1',
        cx: center.x - (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2) + (catetWidth * 3),
        catet1: catetWidth * 2,
        catet2: catetWidth * 2,
        fillColor: getColor('darkSilver'),
    });

    const big_Triangle_2 = createRightTriangle({
        label: 'big_Triangle_2',
        cx: center.x + (outerSquareWidth / 2), 
        cy: center.y - (outerSquareWidth / 2),
        catet1: catetWidth * 2,
        catet2: catetWidth * 2,
        fillColor: getColor('darkSilver'),
        angle: 180,
    });

    const long_rect_1 = createRectangle({
        label: 'long_rect_1',
        x: center.x - catetWidth, 
        y: center.y - catetWidth,
        width: catetWidth, 
        height: catetWidth * 3,
        fillColor: getColor('darkSilver'),
    });

    const triangle_3 = createRightTriangle({
        label: 'triangle_3',
        cx: center.x, 
        cy: center.y + catetWidth,
        catet1: catetWidth * 1.4,
        catet2: catetWidth * 1.4,
        fillColor: getColor('lightCarbon'),
        angle: -135,
    });

    const square_1 = createRectangle({
        label: 'square_1',
        x: center.x, 
        y: center.y,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('lightCarbon'),
    });

    const square_2 = createRectangle({
        label: 'square_2',
        x: center.x + catetWidth, 
        y: center.y - catetWidth,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('brightSilver'),
    });

    const square_3 = createRectangle({
        label: 'square_3',
        x: center.x + catetWidth, 
        y: center.y,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('darkSilver'),
    });

    const square_4 = createRectangle({
        label: 'square_4',
        x: center.x + catetWidth, 
        y: center.y + catetWidth,
        width: catetWidth, 
        height: catetWidth,
        fillColor: getColor('lightCarbon'),
    });

    const semi_circle_1 = createSemiCircle({
        label: 'semi_circle_1',
        cx: center.x + radius,
        cy: center.y - radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),

    });

    const semi_circle_2 = createSemiCircle({
        label: 'semi_circle_2',
        cx: center.x + radius,
        cy: center.y + radius,
        radius: radius,
        fillColor: getColor('brightSilver'),
    });


    const semi_circle_3 = createSemiCircle({
        label: 'semi_circle_3',
        cx: center.x + (radius * 3),
        cy: center.y + radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),
    });

    const semi_circle_4 = createSemiCircle({
        label: 'semi_circle_4',
        cx: center.x + (radius * 3),
        cy: center.y + (radius * 3),
        radius: radius,
        fillColor: getColor('brightSilver'),
        angle: 90,
    });

    const circle_1 = createCircle({
        label: 'circle_1',
        cx: center.x + (radius * 3),
        cy: center.y - radius,
        radius: radius,
        fillColor: getColor('lightCarbon'),
    });

    const circle_2 = createCircle({
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