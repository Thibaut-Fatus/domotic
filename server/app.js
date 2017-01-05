const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const Redoid = require('redoid');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const redoid = Redoid({
    color: [0, 0, 0],
    colorComponentPins: [17, 18, 4],
});

let colors = {
    r: 150,
    g: 55,
    b: 255,
};

redoid.transition([colors.r, colors.g, colors.b], 500);

console.log(process.env);

if (process.env.NODE_ENV !== 'production') {
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
}

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
        colors = JSON.parse(req.body.colors);
        console.log(colors);
        console.log(redoid.isColorValid([colors.r, colors.g, colors.b]));
        // redoid.transition([255 * colors.r, 255 * colors.g, 255 * colors.b], 500, 'easeInOutCubic');
        redoid.change([colors.r, colors.g, colors.b]);
    }
    res.send(colors);
});

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(3000, '0.0.0.0', function () {
    console.log('Example app listening on port 3000!');
});
