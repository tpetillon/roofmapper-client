var webpack = require('webpack');
var Config = require('webpack-config').Config;

module.exports = new Config().merge({
    entry: "./entry.js",
    output: {
        path: __dirname + "/../../server/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css?sourceMap' },
            { test: /\.(png)$/, loader: 'url-loader?limit=100000' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION : JSON.stringify(require("../package.json").version)
        })
    ]
});