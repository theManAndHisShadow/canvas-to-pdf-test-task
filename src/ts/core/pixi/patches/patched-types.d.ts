import { Graphics } from "pixi.js-legacy";

declare module "pixi.js-legacy" {
    interface Graphics {
        label: string | null;
    }
}