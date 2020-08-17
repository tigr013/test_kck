let path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin'); // html плагин
let { CleanWebpackPlugin } = require('clean-webpack-plugin') // Clean плагин (чистит от старых файлов директорию)
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // плагин для выноса css в отдельный файл




// флаг для development
let isDev = process.env.NODE_ENV === 'development' // системные переменные (process), которые мы можем просматривать

// флаг для production
let isProd = !isDev

// определяем название файла исходя из разработки development/production
let filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

// упрощаем код подключения css loaders
// параметр - название loader
let cssLoaders = extra => {
    let loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev, // если development то обновляем данные без перезагрузки страницы
            reloadAll: true
        }
    }, 'css-loader']

    if (extra) {
        loaders.push(extra)
    }

    return loaders;
}

// упрощаем код подключение babel preset
let babelOptions = preset => {
    let opts = {
        presets: [
            '@babel/preset-env', // последняя версия сборки babel for js
        ],
        plugins: [ // плагины для babel
            '@babel/plugin-proposal-class-properties'
        ]
    }
    if (preset) {
        opts.presets.push(preset);
    }
    return opts;
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // путь где лежат все рабочие файлы
    mode: 'development', // тип разработки
    entry: { // точка\и входа
        index: [
            '@babel/polyfill', // подключения полифилов для babel
            './main.js' // основной js файл где все imports
        ]
    },
    output: { // точка выхода
        filename: filename('js'), // файл\ы в который\ые все запишется
        path: path.resolve(__dirname, 'dist') // путь в директорию где будет лежать файл
    },
    resolve: {
        extensions: ['.js', '.json', '.jpg'], // расширения, которые webpack будет понимать по умолчанию
        alias: { // пути которые можно запихнуть в ключ и применять их там где нужно
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: { // сервер, для удобства разработки (все изменения сразу видны в браузере)
        port: 4300,
        hot: isDev
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './index.html',
            minify: { // минифицировать код если это production
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css') // файл в который запишется css
        })
    ],
    module: { // настройка взаимодействия с различными типами файлов (loader)
        rules: [{
                test: /\.css$/, // стили css
                use: cssLoaders()
            },
            {
                test: /\.less$/, // стили less
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/, // стили sass
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/, // картинки
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/, // шрифты
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions()
                }
            }
        ]
    }
}