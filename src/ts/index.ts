import { debugLog, decimal2RGBString, getColor, getFormattedDate } from "./helpers";

import * as PIXI from 'pixi.js-legacy';
import UI from "./UI/UI";

// Импортируем тему и вспомогательную функциз из библиотеки 'json2html'
import draculaV2Theme from "./libs/json2html/themes/user.theme";
import json2html from "./libs/json2html/json2html.min";

// импортируем подготовленные сцены
import createShapeseScene from "./scenes/shapes.scene";
import createQRCodeScene from "./scenes/qr_code.scene";
import createCompositionScene from "./scenes/composition.scene";
import createPerspectiveScene from "./scenes/perspective.scene";
import createSpritesScene from "./scenes/sprites.scene";

// импортируем функцию конвертации и части canvaskit
import pixi2skia from "./core/pixi2skia/convert";
import { CanvasKit } from "../ts/libs/canvaskit-wasm/types";
import CanvasKitInit from "../ts/libs/canvaskit-wasm/canvaskit.js";

/**
 * Данный файл является главным и определяет последовтальность загрузки компонентов, а так же их поведение.
 * Каждый блок кода или определение/вызов функции будут описаны своими комментарием. 
 * Рядом с критически важными функциями будет указатель (римскими цифрами). 
 * Если указателя нет - значит функция выполняет задачу второго плана (ui или helper функция)
 * 
 * Главные этапы работы всего приложения:
 * I   - загрузка бандлов 'canvaskit.js/canvaskit.wasm. От данного этапа зависит доступ к Skia/canvaskit PDF Backend API;
 * II  - создание pixi прилоежения, которое будет отрисовывать сцены (контейнеры), помещённые на уровнеь (stage);
 * III - создание главного контейнера, которое далее будет корневым элементом для конвертации в Skia;
 * IV  - исполнение кода сцен, результат выполнения которых помещается в набор сцен. Так мы изолируем "внешний код" от кода приложения.
 *       Нам нет нужды знать какие там производятся операции, кроме знания, что сцена будет единым конттенером с которым можно просто работать.
 *       Единственно что стоит упомянуть, команды отрисовки силами pixi объединены в "блоки" команд для удобства (если будет интересно взглянуть 
 *       и понять код сцен, то попутно см. /src/ts/core/pixi/wrapper.ts);
 * V   - выбор текущей сцены (контейнера) для отрисовки на pixi холсте и конвертации в skia (и отрисовки силами skia соотвественно);
 * VI  - непосредственно этап отрисовки. Может показаться, что мы только поместили контейнер сцены в главный контейнер, однако в этом и заключается удобство,
 *       ведь это уже задача самого приложения PIXI отрисовать на своём уровне наши команды (группы команд), на самом же деле это именно вызов отрисовки;
 * VII - непосредственно вызов функции конвертации pixi в skia, а далее skia в pdf. Используются функции для интерпретации вызовов pixi в skia (см. /src/ts/core/pixi2skia/convert.ts)
 * На данном этапе основная структура данной реализации: PixiApp -> Stage -> MainContainer -> SceneContainer -> pixi2skiaWrapper() -> ready PDF file.
 * 
 */

// Сссылка на элемент анимации загрузки canvaskit
const preloader = document.querySelector('#app__global-preloder');

// локальная хелпер функция для отрисовки объекта в html
const convertObjectToHTML = (objectToRender: object) => {
    return json2html({
        json: JSON.stringify(objectToRender),
        theme: draculaV2Theme,
        showTypeOnHover: true,
        showLevel: 10,
    });
};

// (I) Подгружаем canvaskit, только если успешно поучили доступ к библиотеке работаем дальше
CanvasKitInit({ locateFile: (file: any) => `../js/${file}` }).then((canvasKit: CanvasKit) => {
    // Немного инфо в консоль
    debugLog("ok", "`canvaskit.wasm` successfully loaded to project");
    debugLog("ok", "`CanvasKit` instance is accessible within the given scope");

    // Глобальная ширина и высота холста
    const width = 450;
    const height = 450;

    // Селекто корневого элемента приложения
    const appRootSelector = '#app-root';

    // Корневой элемент приложения
    const appRoot = document.querySelector(appRootSelector);

    // Проверяем что корень существует и выкидываем ошибку если корень ен найден
    if (!appRoot) {
        debugLog('err', "can`t find '#app-root' element at DOM");
    }

    // Кладём ссылку на холст, предназначенный для отрисовки силами pixi
    const pixijsCanvas: HTMLCanvasElement = document.querySelector('#app__pixijs-canvas');
    pixijsCanvas.width = width;
    pixijsCanvas.height = height;

     // Кладём ссылку на холст, предназначенный для отрисовки силами skia
    const skiaCanvas: HTMLCanvasElement = document.querySelector('#app__skia-canvas');
    skiaCanvas.width = width;
    skiaCanvas.height = height;

    // Центр холста
    const canvasCenterPoint = { x: width / 2, y: height / 2 };

    // (II) Инициализируем pixi приложение
    // Далее все сцены будут сначала отрисовываться именно сюда (на холст "pixijsCanvas")
    const app = new PIXI.Application({
        forceCanvas: true,
        view: pixijsCanvas,
        width: width,
        height: height,
    });

    // Создаём объект интерфейса приложения
    const ui = new UI(appRootSelector, 350, height);

    // (III) Создаём главный контейнер
    // По сути это весь холст (от угла до угла)
    const mainContainer = new PIXI.Container();

    // Обработчик события "обновление контейнера"
    // Нужен для обновления инфо о количестве дочерниъ элементов в главном контейнере
    const mainContainerUpdateHandler = () => {
        if (mainContainer.children.length > 0) {
            const stageData = {
                // -1 потому что подложка тут явно лишяя в подсчёте :)
                contains: `${mainContainer.children[0].children.length - 1} elements`,
            };

            ui.elements.mainContainerInfo.replaceChild(convertObjectToHTML(stageData));
        }
    };

    // Обновляем инфо о дочерних элементах при удалени/добавлении дочерних элементов
    mainContainer.on('childAdded', mainContainerUpdateHandler);
    mainContainer.on('childRemoved', mainContainerUpdateHandler);

    // Установим стандартные параметры для всех сцен - ширрина и фон у всех одинаковый
    const defaultSceneParams = {
        width,
        height,
        centerPoint: canvasCenterPoint,
        background: getColor('carbon'),
    };

    // (IV) Массив подготовленных сцен
    // Имя ключа совпадает с ключом из списка 'ui.element.selectedScenes.valuesList'
    const scenes: Record<string, PIXI.Container> = {
        shapes:       createShapeseScene(defaultSceneParams),
        qr_code:      createQRCodeScene(defaultSceneParams),
        composition:  createCompositionScene(defaultSceneParams),
        perspective:  createPerspectiveScene(defaultSceneParams),
        sprites:      createSpritesScene(defaultSceneParams),
    };

    // (V) Достаём ссылку на выбранный контейнер
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
                        location: object._texture.textureCacheIds[0].split('/')[1],
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


    // (VI) Отрисовываем выбранную сцену 
    mainContainer.addChild(selectedScene);

    ui.elements.exportButton.addEventListener('click', () => {
        console.log('`export-button` is clicked right now!');
    });

    /**
     * Обёртка для pixi2skia.
     * Содержит в себе обработчик при завершении конвертации, 
     * а обработчик в свою очередь внутри скачивает pdf версию холста по нажатию на кнопку
     */
    const pixi2skiaWrapper = () => {
        pixi2skia({
            from: mainContainer,
            to: skiaCanvas,
            use: canvasKit,
            onComplete: convertData => {
                const pageWidth = skiaCanvas.width;
                const pageHeight = skiaCanvas.height;

                // В процессе конвертации просиходит захват итогового холста,
                // объект захвата можно переконвертировать в PDF
                // Функция конвертации возвращает поток Uint8Array, который сразу на месте можно превратить в Blob
                const fileUint8Array = canvasKit.ConvertToPDF(convertData.captured, pageWidth, pageHeight);
                const pdfStream = new Blob([fileUint8Array], { type: 'application/pdf' });

                debugLog('ok', 'skia canvas successfully converted to PDF');

                // Преобразуем Blob в URL для скачивания
                const pdfUrl = URL.createObjectURL(pdfStream);

                let fileName = `skia_canvas_${getFormattedDate()}.pdf`;

                // Скачиваем PDF файл
                const downloadLink = document.createElement('a');
                      downloadLink.href = pdfUrl;
                      downloadLink.download = fileName;
                
                // если накидывать событие через addEventListener, то кнопка будет содержать несколько обработчиков событий
                // и при переключении сцены и нажати на кнопку, будут срабатывать все обработчики для всех посещённых сцен
                // коненчо можно запариться с удалением событий, но можно просто перезаписыать каждый раз,
                // ведь у on + eventName именно такое поведение, что сейчас очень кстати
                ui.elements.exportButton.body.onclick = () => {
                    downloadLink.click();

                    debugLog('ok', `\`${fileName}\` is downloaded`);
                };
            },
        }).catch(console.error);
    };

    // Добавляем возможность выбрать сцену из списка доступных
    ui.elements.selectedScene.addEventListener('change', () => {
        // Очищаем сцену от предыдущих элементов
        mainContainer.removeChildren();

        // Получаем имя сцены из localStorage и находим в массиве сцен
        selectedName = JSON.parse(localStorage.getItem('selectedScene'));
        selectedScene = scenes[selectedName];

        // (VI) Отрисовываем только что выбранную сцену
        mainContainer.addChild(selectedScene);

        // После успешной загрузки canvasKit - вызываем для конвертации pixi в skia и скачивания pdf версии холста
        pixi2skiaWrapper();

        debugLog('ok', 'scene successfully changed');
    });

    // Добавляем контейнер на уровень (холст)
    app.stage.addChild(mainContainer);

    // (VII) После успешной загрузки canvasKit - вызываем для конвертации pixi в skia и скачивания pdf версии холста
    pixi2skiaWrapper();

    // Убираем слой с анимацией загрузки как только всё холсты будут инициализированы и первая конвертация пройдёт успешно
    preloader.classList.add('hidden');
    setTimeout(() => {
        preloader.remove();
    }, 500);

    debugLog('ok', 'the application is fully launched and ready to work');
}).catch((error: any) => {
    console.error('Ошибка загрузки CanvasKit:', error);
});