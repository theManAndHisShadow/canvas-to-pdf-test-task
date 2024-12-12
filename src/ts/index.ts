import { debugLog, getColor } from "./helpers";
import createStripedContainer from "./core/stripedContainer";
import * as PIXI from 'pixi.js-legacy';
import UI from "./UI/UI";

// Глобальная ширина и высота холста
const width = 500;
const height = 500;

const appRootSelector = '#app-root';

// Корневой элемент приложения
const appRoot = document.querySelector(appRootSelector);

// Проверяем что корень существует и выкидываем ошибку если корень ен найден
if(!appRoot) {
    debugLog('err', "can`t find '#app-root' element at DOM");
}

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

// создлаём объект интерфейса
const ui = new UI(appRootSelector, 350, height);

// добавляем первое событие для кнопки
ui.elements.getRandomShape.addEventListener('click', () => {
    debugLog('info', '`ui.elements.getRandomShape` click event triggered');
});

// Создаём главный контейнер
const mainContainer = new PIXI.Container();


// Создаём заготовку фигуры
const triangle_1 = new PIXI.Graphics();

// Отрисовываем заготовку как зелёный треугольник
triangle_1.beginFill(getColor('darkGreen'))
          .lineStyle(3, getColor('brightGreen'))
          .drawPolygon([
                168, 50,   // верхняя вершина
                288, 250,  // правая нижняя вершина
                55, 250    // левая нижняя вершина
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

// Создаём контейнер с полосками, внутри содержатся суб-элементы в виде линий
const subContainer_1 = createStripedContainer(53, 256, 193, 165, 2, 5, 'purple');
subContainer_1.eventMode = 'dynamic';
subContainer_1.on('pointerdown', () => {
    debugLog('info', '`subContainer_1` pointerdown event triggered');
});

const windowTexture = PIXI.Texture.from('../assets/window.png');
const windowSprite = new PIXI.Sprite(windowTexture);

let coeff = 0.75;
windowSprite.width = 339 * coeff;
windowSprite.height = 262 * coeff;

windowSprite.x = 167;
windowSprite.y = 48;

windowSprite.eventMode = 'dynamic';
windowSprite.on('pointerdown', () => {
    debugLog('info', '`windowSprite` pointerdown event triggered');
});

// Добавляем ранее созданные элементы в главный контейнер
mainContainer.addChild(subContainer_1, windowSprite, triangle_1, circle_1, square_1);

// Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);

debugLog('ok', 'app started');