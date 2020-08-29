const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const nodeExternals = require('webpack-node-externals');

const OUTPUT_FOLDER = 'dist';

const config = {
  entry: './src/server/index.ts',
  devtool: 'inline-source-map',
  plugins: [],
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, OUTPUT_FOLDER),
  },
};

if (config.mode !== 'production') {
  config.plugins.push(new WebpackShellPlugin({onBuildEnd: [`nodemon --expose-gc --max-old-space-size=13000 ${OUTPUT_FOLDER}/bundle.js`]}));
}

module.exports = config;