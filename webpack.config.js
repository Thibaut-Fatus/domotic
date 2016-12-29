var path = require('path');
var webpack = require('webpack');

var config = {
    context: path.join(__dirname, 'client'),
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './index.js',
    ],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
module.exports = config;
