const gruvboxLightTheme = {
    container: {
        selector: '.json2html-container',
        properties: {
            background: '#FBF1C7',
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
            color: '#98971A',
        },
    },

    valueTypeBoolean: {
        selector: '.json2html-type__boolean',
        properties: {
            color: '#B16286',
        },
    },

    valueMinusSign: {
        selector: '.json2html-value__minus-sign',
        properties: {
            color: '#CC241D',
        },
    },

    valueTypeNumber: {
        selector: '.json2html-type__number',
        properties: {
            color: '#B16286',
        },
    },

    valueTypeString: {
        selector: '.json2html-type__string',
        properties: {
            color: '#458588',
        },
    },

    valueTypeStringLink: {
        selector: '.json2html-type__string a, .json2html-type__string a:visited',
        properties: {
            color: '#689D6A',
        },
    },

    valueTypeNull: {
        selector: '.json2html-type__null',
        properties: {
            color: '#BDAE93',
        },
    },

    valueTypeUndefined: {
        selector: '.json2html-type__undefined',
        properties: {
            color: '#CC241D',
        },
    },

    valueComplexItemSignature: {
        selector: '.json2html-type__array, .json2html-type__object',
        properties: {
            color: "#7C6F64",
        },
    },

    collapseAllToggle: {
        selector: '.json2html-collapse-all-toggle',
        properties: {
            color: '#7C6F64',
        },
    },
};

export default gruvboxLightTheme;