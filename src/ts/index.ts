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


// Создаём заготовку фигуры
const triangle_1 = new PIXI.Graphics();

// Отрисовываем заготовку как зелёный треугольник
triangle_1.beginFill(getColor('darkGreen'))
          .lineStyle(3, getColor('brightGreen'))
          .drawPolygon([
                165, 50,   // верхняя вершина
                285, 250,  // правая нижняя вершина
                55, 250    // левая нишняя вершина
          ])
          .endFill();
triangle_1.eventMode = 'dynamic';
triangle_1.on('pointerdown', () => {
    debugLog('info', '`triangle_1` pointerdown event triggered');
});


// Создаём заготовку фигуры
const circle_1 = new PIXI.Graphics();

// Отрисовываем заготовку как красный круг
circle_1.lineStyle(3, getColor('brightRed'))
        .beginFill(getColor('darkRed'))
        .drawCircle(centerPos.x, centerPos.y, 100)
        .endFill();
circle_1.eventMode = 'dynamic';
circle_1.on('pointerdown', () => {
    debugLog('info', '`circle_1` pointerdown event triggered');
});


// Создаём заготовку фигуры
const square_1 = new PIXI.Graphics();

// Отрисовываем заготовку как синий квадрат
square_1.lineStyle(3, getColor('brightBlue'))
        .beginFill(getColor('darkBlue'))
        .drawRect(centerPos.x, centerPos.y, 170, 170)
        .endFill();
square_1.eventMode = 'dynamic';
square_1.on('pointerdown', () => {
    debugLog('info', '`square_1` pointerdown event triggered');
});


// Добавляем ранее созданные фигуры в главный контейнер
mainContainer.addChild(triangle_1, circle_1, square_1);

// Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);

debugLog('ok', 'app started');