import { Container } from "pixi.js-legacy";
import { getColor } from "../helpers";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createShowcaseScene = function(params: {centerPoint: {x: number, y: number}}){
    const center = params.centerPoint;
    const sceneContainer = new Container();

    const triangle_1 = PIXI_Wrapper.createEquilateralTriangle({
        label: 'triangle_1',
        cx: 167, 
        cy: 150, 
        sideLength: 230, 
        fillColor: getColor('darkGreen'), 
        borderThickness: 3, 
        borderColor: getColor('brightGreen')
    });

    const square_1 = PIXI_Wrapper.createRectangle({
        label: 'square_1',
        x: center.x, 
        y: center.y, 
        width: 170, 
        height: 170, 
        fillColor: getColor('darkBlue'), 
        borderThickness: 3, 
        borderColor: getColor('brightBlue'),
    });

    const circle_1 = PIXI_Wrapper.createCircle({
        label: 'circle_1',
        cx: center.x, 
        cy: center.y, 
        radius: 100, 
        fillColor: getColor('darkRed'), 
        borderThickness: 3, 
        borderColor: getColor('brightRed')
    });

    const sprite_1 = PIXI_Wrapper.createSprite(167, 48, 254, 196, '../assets/window.png');

    sceneContainer.addChild(sprite_1);
    sceneContainer.addChild(triangle_1);
    sceneContainer.addChild(circle_1);
    sceneContainer.addChild(square_1);

    return sceneContainer;
}

export default createShowcaseScene;