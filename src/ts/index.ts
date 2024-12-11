import { debugLog, getColor } from "./helpers";
import * as PIXI from 'pixi.js-legacy';

// Корневой элемент приложения
const appRoot = document.querySelector('#app-root');

// Проверяем что корень существует и выкидываем ошибку если корень ен найден
if(!appRoot) {
    debugLog('err', "can`t find '#app-root' element at DOM");
}

// Глобальная ширина и высота холста
const width = 500;
const height = 500;

// Центр холста
const centerPos = {x: width / 2, y: height / 2};

// Инициалищзируем pixi приложение
const app = new PIXI.Application({
    width: 500,
    height: 500,
    background: getColor('carbon'),
});

// Добавляем в HTML дерево холст
appRoot.appendChild(app.view as HTMLCanvasElement);

// Создаём главный контейнер
const mainContainer = new PIXI.Container();

// Создаём первую геометрическую фигуру
const circle_1 = new PIXI.Graphics();

// Отрисовываем круг с интерактивностью
circle_1.lineStyle(3, getColor('brightRed'))
        .beginFill(getColor('darkRed'))
        .drawCircle(centerPos.x, centerPos.y, 100)
        .endFill();
circle_1.eventMode = 'dynamic';
circle_1.on('pointerdown', () => {
    console.log('circle_1 pointerdown!', circle_1);
});



// Создаём квадрат
const square_1 = new PIXI.Graphics();

square_1.lineStyle(3, getColor('brightBlue'))
        .beginFill(getColor('darkBlue'))
        .drawRect(centerPos.x, centerPos.y, 170, 170)
        .endFill();
square_1.eventMode = 'dynamic';
square_1.on('pointerdown', () => {
    console.log('square_1 pointerdown!', square_1);
});

// Добавляем фигуру в главный контейнер
mainContainer.addChild(circle_1, square_1);

// Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);

debugLog('ok', 'app started');