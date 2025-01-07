const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const mode = env.mode || 'development';

    return {
        mode: mode,

        entry: './src/ts/index.ts',

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },

                {
                    test: [/\.css$/],
                    use: ['css-loader'],
                },
            ],
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: {
                fs: false,  // или 'empty', если это требуется
                path: require.resolve('path-browserify'),
            }
        },

        output: {
            filename: 'js/bundle.js',
            path: path.resolve(__dirname, 'build'),
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                minify: false,
            }),

            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/css'),
                        to: path.resolve(__dirname, 'build/css'),
                    },
                ],
            }),

            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src/assets'),
                        to: path.resolve(__dirname, 'build/assets'),
                    },
                ],
            }),

            new CopyWebpackPlugin({
                patterns: [
                    {
                        // from: 'node_modules/canvaskit-wasm/bin/canvaskit.wasm',
                        from: './src/ts/libs/canvaskit-wasm/canvaskit.wasm',          // В собранном проекте используется кастомная версия библиотеки
                        to: path.resolve(__dirname, './build/js/', 'canvaskit.wasm')  // Путь, куда будет скопирован файл
                    }
                ]
            })
        ],
    }
};