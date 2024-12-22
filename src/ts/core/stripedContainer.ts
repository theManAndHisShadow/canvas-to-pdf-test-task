import * as PIXI from "pixi.js-legacy";

/**
 * Отрисовывает ряд линий и возвращает их внутри своего контейнера
 * @param x - позиция контейнера по оси х
 * @param y - позиция контейнера по оси у
 * @param width - ширина контейнера с линиями
 * @param height - высота контейнера с линиями
 * @param lineWidth - толщина линии контейнера
 * @param offsetWidth - расстояние между линиями
 * @param lineColor - цвет линии
 * @param angle - угол наклона линий в градусах (по умолчанию 0)
 * @returns - возвращает готовый к манипуляциям контейнер
 */
export function createStripedContainer(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    lineWidth: number, 
    offsetWidth: number, 
    lineColor: string, 
    angle: number = 0
): PIXI.Container {
    let container = new PIXI.Container();

    // Конвертируем угол в радианы
    const radians = (angle * Math.PI) / 180;
    const tan = Math.tan(radians);

    // Создаем маску для обрезки линий по границам контейнера
    const mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF)
        .drawRect(x, y, width, height)
        .endFill();
    container.addChild(mask);
    container.mask = mask;

    // Увеличиваем виртуальную зону отрисовки в 2 раза для покрытия пустот
    const expandedWidth = width + 2 * height * Math.abs(tan);
    const startX = x - height * Math.abs(tan);

    for (let i = startX; i < x + expandedWidth; i += (lineWidth + offsetWidth)) {
        let line = new PIXI.Graphics();

        // Вычисляем наклоненные координаты
        const xStart = i;
        const yStart = y;
        const xEnd = i + height * tan;
        const yEnd = y + height;

        // Преобразуем цвет строки в число
        const lineColorNumber = new PIXI.Color(lineColor).toNumber();

        line.lineStyle(lineWidth, lineColorNumber)
            .moveTo(xStart, yStart)
            .lineTo(xEnd, yEnd);

        container.addChild(line);
    }

    // Устанавливаем область коллизии
    container.hitArea = new PIXI.Rectangle(x, y, width, height);

    return container;
}
