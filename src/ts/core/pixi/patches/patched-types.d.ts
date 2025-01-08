import { Graphics, Container, DisplayObject } from "pixi.js-legacy";

declare module "pixi.js-legacy" {
    interface Graphics {
        /**
         * Graphics object string label
         */
        label: string | null;

        /**
         * Marks if graphics shape is not closed
         */
        isClosed: boolean;
    }

    interface Container {
        /**
         * Container object string label
         */
        label: string | null;
    }

    interface DisplayObject {
        /**
         * DisplayObject string label
         */
        label: string | null;
    }
}