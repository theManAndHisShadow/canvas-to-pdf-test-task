import { debugLog, decimalToRGB, getColor } from "./helpers";
import createStripedContainer from "./core/stripedContainer";
import * as PIXI from 'pixi.js-legacy';
import UI from "./UI/UI";

// Импортируем тему и вспомогательную функциз из библиотеки 'json2html'
import draculaV2Theme from "./libs/json2html/themes/user.theme";
import json2html from "./libs/json2html/json2html.min";

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

interface CollectionItem {
    zIndex: number;
    objectRef: any;
    renderAt: (container: PIXI.Container) => PIXI.Graphics | PIXI.Container | PIXI.Sprite;
}

const objects: Record<string, CollectionItem> = {
    triangle_1: {
        zIndex: 1,
        objectRef: null,
        renderAt: (container: PIXI.Container) => {
            // Создаём заготовку фигуры
            const graphics = new PIXI.Graphics();
            
            // Отрисовываем заготовку как зелёный треугольник
            graphics.beginFill(getColor('darkGreen'))
            graphics.lineStyle(3, getColor('brightGreen'))
            graphics.drawPolygon([
                    168, 50,   // верхняя вершина
                    288, 250,  // правая нижняя вершина
                    55, 250    // левая нижняя вершина
            ]);

            // graphics.endFill();

            container.addChild(graphics);
            return graphics;
        },
    },

    circle_1: {
        zIndex: 3,
        objectRef: null,
        renderAt: (container: PIXI.Container) => {
            // Создаём заготовку фигуры
            const graphics = new PIXI.Graphics();

            // Отрисовываем заготовку как красный круг
            graphics.lineStyle(3, getColor('brightRed'))
            graphics.beginFill(getColor('darkRed'));
            graphics.drawCircle(centerPos.x, centerPos.y, 100);

            // graphics.endFill();

            container.addChild(graphics);
            return graphics;
        },
    },

    square_1: {
        zIndex: 4,
        objectRef: null,
        renderAt: (container: PIXI.Container) => {
            // Создаём заготовку фигуры
            const graphics = new PIXI.Graphics();

            graphics.lineStyle(3, getColor('brightBlue'));
            graphics.beginFill(getColor('darkBlue'));
            graphics.drawRect(centerPos.x, centerPos.y, 170, 170);
            // graphics.endFill();
            
            container.addChild(graphics);
            return graphics;
        },
    },

    subContainer_1: {
        zIndex: 1,
        objectRef: null,
        renderAt: (container: PIXI.Container) => {
            // Создаём контейнер с полосками, внутри содержатся суб-элементы в виде линий
            const subContainer_1 = createStripedContainer(53, 256, 193, 165, 2, 5, 'purple');

            container.addChild(subContainer_1);
            return subContainer_1;
        },
    }, 
    
    sprite_1: {
        zIndex: 0,
        objectRef: null,
        renderAt: (container: PIXI.Container) => {
            const windowTexture = PIXI.Texture.from('../assets/window.png');
            const windowSprite = new PIXI.Sprite(windowTexture);

            let coeff = 0.75;
            windowSprite.width = 339 * coeff;
            windowSprite.height = 262 * coeff;

            windowSprite.x = 167;
            windowSprite.y = 48;

            container.addChild(windowSprite);
            return windowSprite;
        },
    },
};

const renderQueue = Object.fromEntries(Object.entries(objects).sort(([, a], [, b]) => a.zIndex - b.zIndex));

for(const key in renderQueue) {
    let object = objects[key];
    let renderedObject = object.renderAt(mainContainer);

    renderedObject.eventMode = 'dynamic';
    renderedObject.cursor = 'pointer';

    renderedObject.on('pointerover', () => {
        let data: any = {
            name: key,
        };

        if(renderedObject instanceof PIXI.Sprite) {
            data["class"] = "PIXI.Sprite";
            data.texture = {
                url: renderedObject._texture.textureCacheIds[0].split('/')[2],
                width: renderedObject._texture.width,
                height: renderedObject._texture.height,
            }
        } else if(renderedObject instanceof PIXI.Graphics) {
            data["class"] = "PIXI.Graphics";
            // так конечно лучше не делать, но в данном случае я получаю цвет, а не назначаю
            data.fillColor = getColor(decimalToRGB((renderedObject as any)._fillStyle.color));
            data.lineColor = getColor(decimalToRGB((renderedObject as any)._lineStyle.color));
        } else if(renderedObject instanceof PIXI.Container) {
            data["class"] = "PIXI.Container";
            data.contains = renderedObject.children.length + ' elements';
        }

        ui.elements.mouseTarget.replaceChild(convertObjectToHTML(data));

        console.log(renderedObject);
        debugLog('info', '`'+ key +'` pointerover event triggered');
    });

    renderedObject.on('pointerout', () => {
        ui.elements.mouseTarget.resetValue();
    });

    object.objectRef = renderedObject;
    console.log(object);
}
 
// // Добавляем контейнер на уровень (холст)
app.stage.addChild(mainContainer);

debugLog('ok', 'app started');