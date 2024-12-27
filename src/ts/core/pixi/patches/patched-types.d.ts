import { Graphics, Container, DisplayObject } from "pixi.js-legacy";

declare module "pixi.js-legacy" {
    interface Graphics {
        label: string | null;
    }

    interface Container {
        label: string | null;
    }

    interface DisplayObject {
        label: string | null;
    }
}