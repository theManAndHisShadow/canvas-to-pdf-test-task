const githubDarkTheme = {
    container: {
        selector: '.json2html-container',
        properties: {
            background: '#0d1117',
        },
    },

    spoilerToggle: {
        selector: `.json2html-spoiler-toggle--collapsed, .json2html-spoiler-toggle--uncollapsed`,
        properties: {
            color: '#afafaf',
        },
    },

    key: {
        selector: '.json2html-key',
        properties: {
            color: '#c9d1d9',
        },
    },

    valueTypeBoolean: {
        selector: '.json2html-type__boolean',
        properties: {
            color: '#b392f0',
        },
    },

    valueMinusSign: {
        selector: '.json2html-value__minus-sign',
        properties: {
            color: '#ff79c6',
        },
    },

    valueTypeNumber: {
        selector: '.json2html-type__number',
        properties: {
            color: '#9ecbff',
        },
    },

    valueTypeString: {
        selector: '.json2html-type__string',
        properties: {
            color: '#9ecbff',
        },
    },

    valueTypeStringLink: {
        selector: '.json2html-type__string a, .json2html-type__string a:visited',
        properties: {
            color: '#9ecbff',
        },
    },

    valueTypeNull: {
        selector: '.json2html-type__null',
        properties: {
            color: '#6a737d',
        },
    },

    valueTypeUndefined: {
        selector: '.json2html-type__undefined',
        properties: {
            color: '#9ecbff',
        },
    },

    valueComplexItemSignature: {
        selector: '.json2html-type__array, .json2html-type__object',
        properties: {
            color: "#9ecbff",
        },
    },

    collapseAllToggle: {
        selector: '.json2html-collapse-all-toggle',
        properties: {
            color: '#6a737d',
        },
    },
};

export default githubDarkTheme;