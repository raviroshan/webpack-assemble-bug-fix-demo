const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const assembleWebpack = require('assemble-webpack');


const extractPlugin = new ExtractTextPlugin({
  filename: './css/app.css'
});

module.exports = {
    context: path.resolve(__dirname, "src"),

    entry: './js/main.js',

    devServer: {
        contentBase: path.resolve(__dirname, "./dist/assets/media"),
        compress: true,
        port: 12000,
        stats: 'errors-only',
        open: true
    },

    devtool: 'inline-source-map',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        // publicPath: './',
        // filename: 'js/[name].js'
    },

    plugins: [
        new CleanWebpackPlugin(['build']),
        extractPlugin,
        new assembleWebpack.AttachedPlugin({
            baseLayout: './src/hbs/layouts/default.hbs',
            basePages: ['./src/hbs/pages/**/*.hbs'],
            partialsLayout: ['./src/hbs/partials/**/*.hbs'],
            partialsData: ['./src/data/**/*.json']
        })
    ],

    module: {
        rules: [
            //babel-loader
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env']
                    }
                }
            },
            //sass-loader
            {
            test: /\.scss$/,
                include: [path.resolve(__dirname, 'src', 'scss')],
                use: extractPlugin.extract({
                  use: [
                    {
                      loader: 'css-loader',
                      options: {
                        sourceMap: true
                      }
                    },
                    {
                      loader: 'sass-loader',
                      options: {
                        sourceMap: true
                      }
                    }
                  ],
                  fallback: 'style-loader'
                })
            },
             //file-loader
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './assets/media/',
                            publicPath: './assets/media/'
                        }
                    }
                ]
            },
            //asselmble-loader
            {
                test: /\.(hbs)$/,
                use: [
                    {
                        loader: 'assemble-webpack'
                    }
                ]
            }

        ]
    }

};
