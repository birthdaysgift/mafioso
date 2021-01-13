const path = require('path');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main/index.jsx',
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: { extensions: ['*', '.js', '.jsx'] },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ['@babel/env'] }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },

    output: {  
        path: path.resolve(__dirname, 'dist/'),

        // The publicPath property is a special property that helps us with 
        // our dev-server. It specifies the public URL of the the directory — 
        // at least as far as webpack-dev-server will know or care. If this 
        // is set incorrectly, you’ll get 404’s as the server won’t be serving 
        // your files from the correct location.
        publicPath: '/',
        filename: 'bundle.js'
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: process.env.STATIC_PORT,

        // host: '0.0.0.0' to make dev server accesible externally 
        // (from webpack docs)
        host: '0.0.0.0', 

        // Note that devServer also has a publicPath property. 
        // This publicPath tells the server where our bundled code actually is.
        // This might have been a little confusing — Pay really close attention 
        // here: output.publicPath and devServer.publicPath are different. 
        // Read both entries. Twice.
        publicPath: `http://${process.env.STATIC_HOST}:${process.env.STATIC_PORT}/`,

        index: 'index.html',
        hotOnly: true,
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/main/index.html'
        }),
        new webpack.DefinePlugin({
            SOCKET_HOST: JSON.stringify(process.env.SOCKET_HOST),
            SOCKET_PORT: JSON.stringify(process.env.SOCKET_PORT)
        }),
        new FaviconsWebpackPlugin('./src/logo/logo.png')
    ]
};