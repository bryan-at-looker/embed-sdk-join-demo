var path = require('path')
var config = require('./config')
var user = require('./demo/demo_user.json')
var { createSignedUrl, accessToken } = require('./server_utils/auth_utils')

var webpackConfig = {
    mode: 'development',
    entry: {
        demo: './demo/demo.ts'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "demo")
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            config: path.join(__dirname, './config.js'),
        }
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader",
            options: {
                compilerOptions: {
                    declaration: false
                }
            }
        }]
    },
    devServer: {
        host: 'embed.demo',
        port: 8080,
        https: false,
        allowedHosts: [
            'embed.demo',
            'localhost'
        ],
        compress: true,
        contentBase: [
            path.join(__dirname, "demo")
        ],
        watchContentBase: true,
        before: (app) => {
            app.get('/auth', async function(req, res) {
                // Authenticate the request is from a valid user here
                const src = req.query.src;
                const url = createSignedUrl(src, user, config.host, config.secret);
                res.json({ url });
            });
            app.get('/token', async function(req, res) {
                // Authenticate the request is from a valid user here
                const token = await accessToken(req['query']['external_user_id']);
                res.json({ token });
            });
        }
    }
}

module.exports = webpackConfig