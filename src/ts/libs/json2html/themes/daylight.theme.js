const daylightTheme = { 
    container: {
        selector: '.json2html-container',
        properties: {
            background: 'white',
        },
    },

    spoilerToggle: {
        selector: `.json2html-spoiler-toggle--collapsed, .json2html-spoiler-toggle--uncollapsed`,
        properties: {
            color: '#585858',
        },
    },

    key: {
        selector: '.json2html-key',
        properties: {
            color: 'blue',
        },
    },

    valueTypeBoolean: {
        selector: '.json2html-type__boolean',
        properties: {
            color: 'blueviolet',
        },
    },

    valueMinusSign: {
        selector: '.json2html-value__minus-sign',
        properties: {
            color: '#b44343',
        },
    },

    valueTypeNumber: {
        selector: '.json2html-type__number',
        properties: {
            color: '#1e7fcc',
        },
    },

    valueTypeString: {
        selector: '.json2html-type__string',
        properties: {
            color: '#4caf50',
        },
    },

    valueTypeStringLink: {
        selector: '.json2html-type__string a, .json2html-type__string a:visited',
        properties: {
            color: '#4caf50',
        },
    },

    valueTypeNull: {
        selector: '.json2html-type__null',
        properties: {
            color: '#9b9b9b',
        },
    },

    valueTypeUndefined: {
        selector: '.json2html-type__undefined',
        properties: {
            color: '#795548',
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
            color: '#000000',
        },
    },
};

export default daylightTheme;