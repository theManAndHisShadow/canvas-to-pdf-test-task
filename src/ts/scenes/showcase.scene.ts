import { Container } from "pixi.js-legacy";
import { getColor } from "../helpers";
import { createEquilateralTriangle, createRectangle, createCircle } from "../core/shapes";
import { createSprite } from "../core/sprite";
import { createStripedContainer } from "../core/stripedContainer";

const createShowcaseScene = function(params: {centerPoint: {x: number, y: number}}){
    const center = params.centerPoint;
    const sceneContainer = new Container();

    const triangle_1 = createEquilateralTriangle({
        label: 'triangle_1',
        cx: 167, 
        cy: 150, 
        sideLength: 230, 
        fillColor: getColor('darkGreen'), 
        borderThickness: 3, 
        borderColor: getColor('brightGreen')
    });

    const square_1 = createRectangle({
        label: 'square_1',
        x: center.x, 
        y: center.y, 
        width: 170, 
        height: 170, 
        fillColor: getColor('darkBlue'), 
        borderThickness: 3, 
        borderColor: getColor('brightBlue'),
    });

    const circle_1 = createCircle({
        label: 'circle_1',
        cx: center.x, 
        cy: center.y, 
        radius: 100, 
        fillColor: getColor('darkRed'), 
        borderThickness: 3, 
        borderColor: getColor('brightRed')
    });

    const sprite_1 = createSprite(167, 48, 254, 196, '../assets/window.png');
    const subContainer_1 = createStripedContainer(53, 256, 193, 165, 2, 5, 'purple', -45);

    sceneContainer.addChild(sprite_1);
    sceneContainer.addChild(triangle_1);
    sceneContainer.addChild(subContainer_1);
    sceneContainer.addChild(circle_1);
    sceneContainer.addChild(square_1);

    return sceneContainer;
}

export default createShowcaseScene;