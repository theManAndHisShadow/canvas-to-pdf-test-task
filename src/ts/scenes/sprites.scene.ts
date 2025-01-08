import { getColor } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createSpritesScene = function(params: {centerPoint: {x: number, y: number}, width: number, height: number, background: string}){
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


    const wallpaper_sprite = PIXI_Wrapper.createSprite('../assets/old_wallpaper.png', 0, 0, params.width, params.width);
    const sprite_1 = PIXI_Wrapper.createSprite('../assets/aircraft98.png', 127, 78, 254, 196);
    const sprite_2 = PIXI_Wrapper.createSprite('../assets/win_install.png', 67, 188, 254, 196);

    sceneContainer.addChild(wallpaper_sprite);
    sceneContainer.addChild(sprite_1, sprite_2);

    return sceneContainer;
}

export default createSpritesScene;