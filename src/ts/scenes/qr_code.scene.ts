import { getColor } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createQRCodeScene = function(params: {centerPoint: {x: number, y: number}, width: number, height: number, background: string}){
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


    const qr_code = drawQR(qr_sequence, 45, 45, 360, 360);

    sceneContainer.addChild(qr_code);

    return sceneContainer;
}

function drawQR(sequence: number[][], startX: number, startY: number, width: number, height: number): PIXI.Container {
    const qrCodeContainer = new PIXI.Container();
          qrCodeContainer.label = 'qr_code_container';


    const padding = 3;                               // Количество строк/столбцов для отступов
    const gridSize = sequence.length + 2 * padding;  // Увеличенный размер сетки с учетом отступов
    const cellSize = Math.floor(width / gridSize);   // Округляем размер ячейки до целого числа, иначе могут появиться щели

    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
        for (let colIndex = 0; colIndex < gridSize; colIndex++) {
            const isPadding = 
                rowIndex < padding || rowIndex >= gridSize - padding || 
                colIndex < padding || colIndex >= gridSize - padding;

            const x = startX + colIndex * cellSize;
            const y = startY + rowIndex * cellSize;

            const fillColor = isPadding 
                ? getColor('white') 
                : sequence[rowIndex - padding]?.[colIndex - padding] === 1 
                    ? getColor('carbon') 
                    : getColor('white');

            const cellGraphics = PIXI_Wrapper.createRectangle({
                label: `cell_(${colIndex},${rowIndex})`,
                fillColor,
                borderThickness: 0,
                width: cellSize + 0.5, // Чуть увеличиваем размеры ячейки, чтобы не появлялись щели
                height: cellSize + 0.5,
                x,
                y,
            });

            qrCodeContainer.addChild(cellGraphics);
        }
    }

    return qrCodeContainer;
}


const qr_sequence = [
    [ 1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,1,1,0,1,1,0,0,1,1,0,1,1,1,1,1,1,1 ],
    [ 1,0,0,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,1,0,1,0,0,0,0,0,1 ],
    [ 1,0,1,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1 ],
    [ 1,0,1,1,1,0,1,0,0,1,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,1,0,1 ],
    [ 1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,1 ],
    [ 1,0,0,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,1 ],
    [ 1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1 ],
    [ 0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0 ],
    [ 0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,0,1,0,1,1,1,1,0,1,1,0,0,0,1,0 ],
    [ 0,1,1,0,0,1,0,1,1,1,1,0,0,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0 ],
    [ 0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,1,1,1,1,0,0,0,1,1,0,0,1,0 ],
    [ 1,1,1,1,0,0,0,1,1,0,1,1,0,0,0,0,1,1,0,1,0,1,0,0,0,0,1,0,1,0,0,1,1 ],
    [ 1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1 ],
    [ 1,0,0,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,0 ],
    [ 0,0,1,0,0,1,1,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,1,0,0,1,0 ],
    [ 1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,0,1,1,1,1,0,1,0 ],
    [ 0,0,0,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,0,0,0,1,1,0,1,1,1,0 ],
    [ 1,0,0,1,1,0,0,0,1,0,1,1,1,0,0,1,0,0,0,0,0,1,0,1,1,0,0,1,0,0,0,1,1 ],
    [ 1,1,0,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,0,0,0,1,0,1,1,1,1,0,0,1,0,1,1 ],
    [ 1,1,1,1,0,1,0,1,0,1,1,1,0,0,0,0,0,1,0,1,0,1,1,0,0,0,1,0,0,0,0,0,1 ],
    [ 0,0,1,1,0,0,1,0,1,1,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0 ],
    [ 1,1,0,1,1,1,0,0,0,1,0,1,1,0,1,1,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,1,0 ],
    [ 0,0,1,0,0,0,1,1,1,1,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,1,0,1,0 ],
    [ 0,0,0,0,1,0,0,1,1,0,1,1,1,1,0,0,1,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,1 ],
    [ 1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0 ],
    [ 0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1,1,0,0,0,1,1,1,0,0 ],
    [ 1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0,1,1,0,1,0 ],
    [ 1,0,0,0,0,0,1,0,1,1,0,0,1,1,0,0,0,1,1,1,0,0,1,0,1,0,0,0,1,1,0,1,1 ],
    [ 1,0,1,1,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,1,1,1,1,0,0,0,0 ],
    [ 1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,0,0,1 ],
    [ 1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,1,0,0,0,1,1,0,1,1,1,0,0 ],
    [ 1,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,1,0,0,1,1,0,1,1,0,1,1,0,1,0,0 ],
    [ 1,1,1,1,1,1,1,0,0,1,1,0,1,1,1,0,0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,0,1 ]
]

export default createQRCodeScene;