import { debugLog, decimalToRGB, getColor } from "./helpers";

import * as PIXI from 'pixi.js-legacy';
import UI from "./UI/UI";

// Импортируем тему и вспомогательную функциз из библиотеки 'json2html'
import draculaV2Theme from "./libs/json2html/themes/user.theme";
import json2html from "./libs/json2html/json2html.min";

// импортируем подготовленные сцены
import createShowcaseScene from "./scenes/showcase.scene";
import createCompositionScene from "./scenes/composition.scene";

// локальная хелпер функция для отрисовки объекта в html
const convertObjectToHTML = (objectToRender: object) => {
    //@ts-ignore
    return json2html({
        json: JSON.stringify(objectToRender),
        theme: draculaV2Theme,
        showTypeOnHover: true,
        showLevel: 10,
    });
};

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
const canvasCenterPoint = {x: width / 2, y: height / 2};

// Инициалищзируем pixi приложение
const app = new PIXI.Application({
    width: 500,
    height: 500,
    background: getColor('carbon'),
    forceCanvas: true,
});

// Добавляем в HTML дерево холст
appRoot.appendChild(app.view as HTMLCanvasElement);

// создлаём объект интерфейса
const ui = new UI(appRootSelector, 350, height);

// Создаём главный контейнер
const mainContainer = new PIXI.Container();

// Обработчик события "обновление контейнера"
const mainContainerUpdateHandler = () => {
    if(mainContainer.children.length > 0) {
        const stageData = {
            contains: `${mainContainer.children[0].children.length} elements`,
        };
    
        ui.elements.mainContainerInfo.replaceChild(convertObjectToHTML(stageData));
    }
};

// обновляем инфо при обновлении наполнения контейнера
mainContainer.on('childAdded', mainContainerUpdateHandler);
mainContainer.on('childRemoved', mainContainerUpdateHandler);

// Массив подготовленных сцен
// Имя ключа совпадает с ключом из списка 'ui.element.selectedScenes.valuesList'
const scenes: Record<string, any> = {
    showcase: createShowcaseScene({
        centerPoint: canvasCenterPoint,
    }),

    composition: createCompositionScene({
        centerPoint: canvasCenterPoint,
    }),
};

// 
let selectedName = JSON.parse(localStorage.getItem('selectedScene'));
let selectedScene: PIXI.Container = scenes[selectedName];

// Инициализация ранее выбранной сцены
mainContainer.addChild(selectedScene);


// Добавляем интерактивность к объектам всех сцен
Object.values(scenes).forEach(scene => {
    for (const object of scene.children) {
        object.eventMode = 'dynamic';
        object.cursor = 'pointer';

        // Событие при наведении
        object.on('pointerover', () => {
            let data: any = {
                name: object.label,
            };

            // Настраиваем объект data в зависимости от типа объекта сцены
            if (object instanceof PIXI.Sprite) {
                data["class"] = "PIXI.Sprite";
                data.texture = {
                    url: object._texture.textureCacheIds[0].split('/')[2],
                    width: object._texture.width,
                    height: object._texture.height,
                }
            } else if (object instanceof PIXI.Graphics) {
                data["class"] = "PIXI.Graphics";
                // так конечно лучше не делать, но в данном случае я получаю цвет, а не назначаю
                data.fillColor = getColor(decimalToRGB((object as any)._fillStyle.color));
                data.lineColor = getColor(decimalToRGB((object as any)._lineStyle.color));
            } else if (object instanceof PIXI.Container) {
                data["class"] = "PIXI.Container";
                data.contains = object.children.length + ' elements';
            }

            // Обновляем данные по текущей цели мыши
            ui.elements.mouseTarget.replaceChild(convertObjectToHTML(data));

            debugLog('info', '`' + object.label + '` pointerover event triggered');
        });

        object.on('pointerout', () => {
            ui.elements.mouseTarget.resetValue();
        });
    }
});

// Добавляем возможность выбрать сцену из списка доступных
ui.elements.selectedScene.addEventListener('change', () => {
    // Очищаем сцену от предыдущих элементов
    mainContainer.removeChildren();

    // Получаем имя сцены из localStorage и находим в массиве сцен
    selectedName = JSON.parse(localStorage.getItem('selectedScene'));
    selectedScene = scenes[selectedName]; 

    // передобавляем сцену в главный окнтейнер
    mainContainer.addChild(selectedScene);

    debugLog('ok', 'scene successfully changed');
});
 
// Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);


debugLog('ok', 'app started');