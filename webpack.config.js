var webpack = require('webpack');

module.exports = {
    entry: './src/TestApp.ts',
    devtool: 'source-map',
    output: {
        filename: 'js/bundle.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".d.ts"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'awesome-typescript-loader'
            }
        ]
    }
};