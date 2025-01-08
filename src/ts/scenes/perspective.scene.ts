import { getColor } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";


// Вспомогательная локальная функция
// Возвращает логарифмическую последовательность в указанном диапазоне
function getLogSequence(from: number, to: number, steps = 10) {
    if (from <= 0 || to <= 0) {
        throw new Error("Both 'from' and 'to' must be greater than 0.");
    }

    const logFrom = Math.log(from);
    const logTo = Math.log(to);
    const stepSize = (logTo - logFrom) / (steps - 1);

    const sequence = [];
    for (let i = 0; i < steps; i++) {
        const value = Math.exp(logFrom + i * stepSize);
        sequence.push(value);
    }

    return sequence;
}

const createPerspectiveScene = function(params: {centerPoint: {x: number, y: number}, width: number, height: number, background: string}){
    const center = params.centerPoint;
    const sceneContainer = new PIXI.Container();

    const outerSquareWidth = 360;
    const outerSquareHeight = 290;
    const depth = 20;
    const distanceSequence = getLogSequence(1, depth, depth);

    const stepW = outerSquareWidth / depth;
    const stepH = outerSquareHeight / depth;

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

    for (let i = depth - 1; i >= 0; i--) {
        const localWidth = stepW * distanceSequence[i];
        const localHeight = stepH * distanceSequence[i];
        const localX = center.x - localWidth / 2;
        const localY = center.y - localHeight / 2;
        const borderColor = getColor('carbon');

        // Плавный переход цвета от белого к чёрному
        const colorStep = 255 - Math.round((1 - i / (depth - 1)) * 255);
        const fillColor = `rgba(${colorStep},${colorStep},${colorStep},1)`;

        let square = PIXI_Wrapper.createRectangle({
            label: 'square_' + (i + 1),
            x: localX,
            y: localY,
            width: localWidth,
            height: localHeight,
            fillColor: fillColor,
            borderColor: borderColor,
            borderThickness: 1,
        });

        sceneContainer.addChild(square);

        // Отрисовываем линии первспективы для внутренних фигур
        if(i < depth - 2) {
            let amount = 10;
            let line = new PIXI.Graphics();
            line.lineStyle(1, getColor('carbon'));

            // через цикл отрисовываем линии (точка на грани - центр) начиная от одного угла со смещением до соседнего
            for (let i = 0; i <= amount; i++) {
                let offsetX = i * (localWidth / amount);
                let offsetY = i * (localHeight /  amount);
                // верхняя грань к центру
                line.moveTo(center.x, center.y);
                line.lineTo(localX + offsetX, localY);

                // левая грань к центру
                line.moveTo(center.x, center.y);
                line.lineTo(localX, localY + offsetY);

                //правая грань к центру
                line.moveTo(center.x, center.y);
                line.lineTo(localX + localWidth, localY + offsetY);

                // нижняя грань к центру
                line.moveTo(localX + offsetX, localY + localHeight);
                line.lineTo(center.x, center.y);
            }

            sceneContainer.addChild(line);
        }
    }

    return sceneContainer;
}

export default createPerspectiveScene;