const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    mode:'development',
    entry: {
      React: './src/index.js',
    },
    resolve:{
      alias:{
        react:path.resolve(__dirname+'src/React')
      }
    },
    devtool: 'cheap-module-source-map',
    devServer: {
     contentBase: './dist'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development',
        template:'./test/index.html'
        
      })
    ],
    output: {
      filename: 'React.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                include:path.resolve(__dirname, 'src'),
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ["env", "react"],
                    plugins: [
                        "transform-react-jsx",
                        "transform-class-properties",
                        "transform-object-rest-spread"
                    ]
                },
            }
        ]
    }
  };