import { debugLog } from "./helpers";
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
    background: 'black',
});

// Добавляем в HTML дерево холст
appRoot.appendChild(app.view as HTMLCanvasElement);

// Создаём главный контейнер
const mainContainer = new PIXI.Container();

// Создаём первую геометрическую фигуру
const geometry1 = new PIXI.Graphics();

// Отрисовываем круг с интерактивностью
geometry1.beginFill('#ff0000').drawCircle(centerPos.x, centerPos.y, 100).endFill();
geometry1.eventMode = 'dynamic';
geometry1.on('pointerdown', () => {
    console.log('geometry1 pointerdown!', geometry1);
});

// Добавляем фигуру в главный контейнер
mainContainer.addChild(geometry1);

// Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);

debugLog('ok', 'app started');