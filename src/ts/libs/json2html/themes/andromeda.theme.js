const andromedaTheme = {
    container: {
        selector: '.json2html-container',
        properties: {
            background: '#23262E',
        },
    },

    spoilerToggle: {
        selector: `.json2html-spoiler-toggle--collapsed, .json2html-spoiler-toggle--uncollapsed`,
        properties: {
            color: '#9c967a',
        },
    },

    key: {
        selector: '.json2html-key',
        properties: {
            color: '#00e8c6',
        },
    },

    valueTypeBoolean: {
        selector: '.json2html-type__boolean',
        properties: {
            color: '#ee5d43',
        },
    },

    valueMinusSign: {
        selector: '.json2html-value__minus-sign',
        properties: {
            color: '#ee5d43',
        },
    },

    valueTypeNumber: {
        selector: '.json2html-type__number',
        properties: {
            color: '#f39c12',
        },
    },

    valueTypeString: {
        selector: '.json2html-type__string',
        properties: {
            color: '#96E072',
        },
    },

    valueTypeStringLink: {
        selector: '.json2html-type__string a, .json2html-type__string a:visited',
        properties: {
            color: '#3B79C7',
        },
    },

    valueTypeNull: {
        selector: '.json2html-type__null',
        properties: {
            color: '#4e4f54',
        },
    },

    valueTypeUndefined: {
        selector: '.json2html-type__undefined',
        properties: {
            color: '#f92672',
        },
    },

    valueComplexItemSignature: {
        selector: '.json2html-type__array, .json2html-type__object',
        properties: {
            color: "#646b7c",
        },
    },

    collapseAllToggle: {
        selector: '.json2html-collapse-all-toggle',
        properties: {
            color: '#8490a8',
        },
    },
};

export default andromedaTheme;