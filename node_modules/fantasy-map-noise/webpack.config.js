/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
});

module.exports = {
    devtool: 'source-map',
    entry: {
        app: [path.resolve(__dirname, 'src/noise.js')]
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'main.js',
        libraryTarget: 'umd'
    },
    plugins: [definePlugin],
    module: {
    },
    resolve: {
        extensions: ['.js']
    }
};
