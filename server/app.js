var express = require('express');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var app = express();

if (module.hot) {
    module.hot.accept();
}

(function() {

    // Step 1: Create & configure a webpack compiler
    var webpack = require('webpack');
    var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../webpack.config');
    var compiler = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(webpackHotMiddleware(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
})();

app.get('/', function (req, res) {
    res.sendFile('client/index.html', {"root": '.'});
});

app.get('/static/bundle.js', function (req, res) {
    res.sendFile('static/bundle.js', {"root": '.'});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
