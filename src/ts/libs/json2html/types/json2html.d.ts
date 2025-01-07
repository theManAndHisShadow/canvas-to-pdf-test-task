declare type Theme = {
    [key: string]: {                     // HTML element key name, for example: 'spoilerToggle'
        selector: string,                // HTML element selector, for example '.json2html-spoiler-toggle--collapsed, .json2html-spoiler-toggle--uncollapsed'
        properties: {                    // CSS properties, for example: 'color', 'background',
            [key: string]: string,
        },
    },
};

declare type ThemeLibrary = {
    [key: string]: {
        app: Theme,                     // Theme for whole app (optional)
        renderedJSON: Theme,            // Theme for rendered JSON 
    }
};

declare type ErrorHandler = (error: Error) => void;

/**
 * Renders JSON string in colored and formatted HTML block.
 * @param params.json JSON string to render
 * @param params.rootName Name of root rendered object key. By default 'json'.
 * @param params.renderNestedLength Allows render Array length in Array type signature. By default - true.
 * @param params.highlightLinks Allows render url string as <a> clickable tag. By default - true.
 * @param params.openLinksInNewTab On true value - opens links at new browser tab. By default - true.
 * @param params.collapseAll On true value - renders HTML block at start with minimized (collapsed) content. By default - true.
 * @param params.showLevel Collapse all levels except given level value.
 * This option ignoring if params.collapseAll is true! By default - 1.
 * @param params.showTypeOnHover On true value - show default html "title" tooltip on primitive values with their type. By default - true.
 * @param params.theme Renders HTML block using given 'Theme' object.
 * Supports 9 themes: andromeda, daylight, dracula, gruvbox-dark, gruvbox-light, github-light, github-dark, horizon, monokai.
 * Also supports user themes. For more info check project`s github mini wiki.
 * @param params.onError error handler callback function, gives access to Error instance.
 * @param params.groupBigArrayItemsBy Size of group in big array. By default - 100. Minimum value - 25
 * That means if array length > 100 - array will be grouped onto 'n' groups by 100 items.
 * @returns
 */
export default function json2html(params: {
    json: string;
    rootName?: string;
    renderNestedLength?: boolean;
    highlightLinks?: boolean;
    openLinksInNewTab?: boolean;
    collapseAll?: boolean;
    showLevel?: number;
    showTypeOnHover?: boolean;
    theme: Theme;
    onError?: ErrorHandler;
    groupBigArrayItemsBy?: number;
}): HTMLDivElement;
