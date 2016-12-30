const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const Redoid = require('redoid');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const redoid = Redoid({
    color: '#300000',
    loopTransition: true,
    colorComponentPins: [17, 18, 4],
});

let colors = {
    r: 1,
    g: 1,
    b: 1,
};

redoid.transition([255 * colors.r, 255 * colors.g, 255 * colors.b], 5000);

if (module.hot) {
    module.hot.accept();
}

(function() {

    // Step 1: Create & configure a webpack compiler
    const webpack = require('webpack');
    const webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../webpack.config');
    const compiler = webpack(webpackConfig);

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
    res.sendFile('client/index.html', { root: '.' });
});

app.get('/static/bundle.js', function (req, res) {
    res.sendFile('static/bundle.js', { root: '.' });
});

// API
app.get('/api/colors', function (req, res) {
    res.send(colors);
});

app.post('/api/colors', function (req, res) {
    if (req.body.colors !== undefined) {
        colors = req.body.colors;
        redoid.transition([255 * colors.r, 255 * colors.g, 255 * colors.b], 3000);
    }
    res.send(colors);
});

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(3000, '0.0.0.0', function () {
    console.log('Example app listening on port 3000!');
});
