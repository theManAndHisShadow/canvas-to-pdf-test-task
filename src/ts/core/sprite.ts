import { Texture, Sprite } from 'pixi.js-legacy';

/**
 * Создаёт спрайт
 * @param x - координата позиции по оис икс
 * @param y - координата позиции по оси игрек
 * @param width - ширина спрайта
 * @param height - высота спрайта
 * @param src - путь к текстуре спрайта
 * @returns - спрайт
 */
export function createSprite(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    src: string
): Sprite {
    const spriteTexture = Texture.from(src);
    const windowSprite = new Sprite(spriteTexture);

    windowSprite.width = width;
    windowSprite.height = height;

    windowSprite.x = x;
    windowSprite.y = y;

    return windowSprite;
}