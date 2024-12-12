import { Container } from "pixi.js-legacy";
import * as PIXI from 'pixi.js-legacy';

/**
 * Отрисовывает ряд линий и возвращает их родительский контейнер
 * @param x - позиция контейнера по оси х
 * @param y - позиция контейнера по оси у
 * @param width - ширина контейнера с линиями
 * @param height - высота контейнера с линиями
 * @param lineWidth - толщина линии контейнера
 * @param offsetWidth - расстояние между линиями
 * @param lineColor - цвет линии
 * @returns - возвращает готовый к манипуляциям контейнер
 */
export default function createStripedContainer(x: number, y: number, width: number, height: number, lineWidth: number, offsetWidth: number, lineColor: string): Container {
    let container = new PIXI.Container();

    for(let i = 0; i < width; i += (lineWidth + offsetWidth)) {
        let line = new PIXI.Graphics();

        line.lineStyle(lineWidth, lineColor)
            .beginFill()
            .moveTo(x + i, y)
            .lineTo(x + i, y + height)
            .endFill();

        container.addChild(line);
    }

    // Устанавливаем хитовую область
    container.hitArea = new PIXI.Rectangle(x, y, x + width, y + height);

    return container;
}