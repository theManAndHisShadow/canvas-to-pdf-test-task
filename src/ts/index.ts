import { debugLog, decimal2RGBString, getColor } from "./helpers";

import * as PIXI from 'pixi.js-legacy';
import UI from "./UI/UI";

// Импортируем тему и вспомогательную функциз из библиотеки 'json2html'
import draculaV2Theme from "./libs/json2html/themes/user.theme";
import json2html from "./libs/json2html/json2html.min";

// импортируем подготовленные сцены
import createShowcaseScene from "./scenes/showcase.scene";
import createRandomShapesScene from "./scenes/random.scene";
import createCompositionScene from "./scenes/composition.scene";
import createPerspectiveScene from "./scenes/perspective.scene";

import pixi2skia from "./core/pixi2skia/convert";
import CanvasKitInit from "canvaskit-wasm";

const preloader = document.querySelector('#app__global-preloder');

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

CanvasKitInit({ locateFile: (file) => `../js/${file}` }).then((canvasKit) => {
    debugLog("ok", "`canvaskit.wasm` successfully loaded to project");
    debugLog("ok", "`CanvasKit` instance is accessible within the given scope");

    // Глобальная ширина и высота холста
    const width = 450;
    const height = 450;

    const appRootSelector = '#app-root';

    // Корневой элемент приложения
    const appRoot = document.querySelector(appRootSelector);

    // Проверяем что корень существует и выкидываем ошибку если корень ен найден
    if (!appRoot) {
        debugLog('err', "can`t find '#app-root' element at DOM");
    }

    const pixijsCanvas: HTMLCanvasElement = document.querySelector('#app__pixijs-canvas');
    pixijsCanvas.width = width;
    pixijsCanvas.height = height;

    const skiaCanvas: HTMLCanvasElement = document.querySelector('#app__skia-canvas');
    skiaCanvas.width = width;
    skiaCanvas.height = height;

    // Центр холста
    const canvasCenterPoint = { x: width / 2, y: height / 2 };

    // Инициализируем pixi приложение
    const app = new PIXI.Application({
        forceCanvas: true,
        view: pixijsCanvas,
        width: width,
        height: height,
        background: getColor('carbon'),
    });

    // Добавляем в HTML дерево холст
    appRoot.appendChild(app.view as HTMLCanvasElement);

    // создлаём объект интерфейса
    const ui = new UI(appRootSelector, 350, height);

    // Создаём главный контейнер
    const mainContainer = new PIXI.Container();

    // Обработчик события "обновление контейнера"
    const mainContainerUpdateHandler = () => {
        if (mainContainer.children.length > 0) {
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
    const scenes: Record<string, PIXI.Container> = {
        showcase: createShowcaseScene({
            centerPoint: canvasCenterPoint,
        }),

        random: createRandomShapesScene({
            centerPoint: canvasCenterPoint,
        }),

        composition: createCompositionScene({
            centerPoint: canvasCenterPoint,
        }),

        perspective: createPerspectiveScene({
            centerPoint: canvasCenterPoint,
        }),
    };

    // 
    let selectedName = JSON.parse(localStorage.getItem('selectedScene'));
    let selectedScene: PIXI.Container = scenes[selectedName];

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
                    data.fillColor = getColor(decimal2RGBString((object as any)._fillStyle.color)) || decimal2RGBString((object as any)._fillStyle.color);
                    data.lineColor = getColor(decimal2RGBString((object as any)._lineStyle.color));
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


    // Инициализация ранее выбранной сцены
    mainContainer.addChild(selectedScene);


    // Добавляем возможность выбрать сцену из списка доступных
    ui.elements.selectedScene.addEventListener('change', () => {
        // Очищаем сцену от предыдущих элементов
        mainContainer.removeChildren();

        // Получаем имя сцены из localStorage и находим в массиве сцен
        selectedName = JSON.parse(localStorage.getItem('selectedScene'));
        selectedScene = scenes[selectedName];

        // передобавляем сцену в главный окнтейнер
        mainContainer.addChild(selectedScene);


        // После успешной загрузки используйте canvasKit
        pixi2skia({
            from: mainContainer,
            to: skiaCanvas,
            use: canvasKit,
        }).catch(console.error);

        debugLog('ok', 'scene successfully changed');
    });

    // Добавляем контейнер на уровень (холст)
    app.stage.addChild(mainContainer);

    // После успешной загрузки используем canvasKit
    pixi2skia({
        from: mainContainer,
        to: skiaCanvas,
        use: canvasKit,
    }).catch(console.error);

    // Убираем слой с анимацией загрузки как только всё холсты будут инициализированы и первая конвертация пройдёт успешно
    preloader.classList.add('hidden');
    setTimeout(() => {
        preloader.remove();
    }, 500);

    debugLog('ok', 'the application is fully launched and ready to work');
}).catch((error) => {
    console.error('Ошибка загрузки CanvasKit:', error);
});