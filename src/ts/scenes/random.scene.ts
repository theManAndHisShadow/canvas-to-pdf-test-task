import { getColor, getRandomNumber } from "../helpers";
import * as PIXI from "pixi.js-legacy";
import * as PIXI_Wrapper from "../core/pixi/wrapper";

const createRandomShapesScene = function(params: {centerPoint: {x: number, y: number}}){
    // Глобальные переменные сцены
    const sceneContainer = new PIXI.Container();
    const center = params.centerPoint;                  // Центер сцены

    const globalWidth = 400;                            // Размер всего доступного поля
    const cellSize = 50;                                // Размер ячейки
    const rows = globalWidth / cellSize;                // Количество строк
    const columns = globalWidth / cellSize;             // количество колонок

    const startX = (center.x - (globalWidth / 2));      // икс координата начала поля
    const startY = (center.y - (globalWidth / 2))       // игрек координата начала поля

    const colors = ['salad', 'chocolate', 'blueberry']  // Доступные цвета
    let counter = 0;                                    // Счётчик фигур

    // Отрисовываем в 2 циклах колонки и строки
    for(let x = 0; x < columns; x++) {
        for(let y = 0; y < rows; y++) {
            // Будте ли фигура или пустота
            let exist = getRandomNumber(0, 2) !== 0 ? true : false;

            // если будет существовать           
            if(exist) {
                // обновляем счётчик
                counter += 1;

                // Генерируцем цвет из списка доступнызх для сцены (масси colors)
                let color = colors[getRandomNumber(0, 2)];

                // Создаём экземпляр фигуры
                const sqaure = PIXI_Wrapper.createRectangle({
                    label:  'square_' + counter,
                    x: startX + (x * cellSize), 
                    y: startY + (y * cellSize), 
                    width: cellSize, 
                    height: cellSize,
                    fillColor: getColor(color), 
                });
    
                sceneContainer.addChild(sqaure);

                // генерируем внутреннюю фигуру
                let isHasInner = getRandomNumber(0, 2) !== 0 ? true : false;

                // Если фигура будет существовать
                if(isHasInner) {
                    // Задаём дополнительный цвет для неё и размер для внутренней фигуры
                    const innerColors = [...colors, 'carbon'];
                    const innerSize = cellSize / 2;
                    let innerColor = innerColors[getRandomNumber(0, 3)];

                    // Чтобы не было совпадения по цвету - повторяем генерацию цвета до тех пор
                    // пока цвета не будут разными
                    while(innerColor === color) {
                        innerColor = innerColors[getRandomNumber(0, 3)];
                    }

                    // СОздаём объектв нутр фигуры
                    const innerSquare = PIXI_Wrapper.createRectangle({
                        label:  'innerSquare_' + counter,
                        x: startX + (x * cellSize) + (innerSize / 2), 
                        y: startY + (y * cellSize) + (innerSize / 2), 
                        width: innerSize, 
                        height: innerSize,
                        fillColor: getColor(innerColor), 
                    });
        
                    sceneContainer.addChild(innerSquare);
                }
            }
        }
    }

    return sceneContainer;
}

export default createRandomShapesScene;