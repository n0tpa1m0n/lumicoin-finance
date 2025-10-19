const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath:'/'
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
        hot: true,
        liveReload: true,
        open: true,
        watchFiles: ['src/**/*', 'index.html'],
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            // {
            //     test: /\.css$/i,
            //     use: [
            //         "style-loader",
            //         "css-loader",
            //     ],
            // },
        ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: './index.html'
    }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/static/images", to: "images" },
                { from: "./node_modules/bootstrap/dist/css/**/*", to: "css" },
                // { from: "./node_modules/bootstrap/dist/js/**/*", to: "js" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js/bootstrap.js" },


            ],
        }),
    ],
};