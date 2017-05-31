// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackPostcssTools = require('webpack-postcss-tools')

const variables = require('./package.json').cssVariables
const theme = webpackPostcssTools.makeVarMap(variables)

const path = require('path')

const BASE_DIR = process.cwd()

module.exports = {
  entry: ['babel-polyfill', path.join(BASE_DIR, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {

    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [{
          // @remove-on-eject-begin
          // Point ESLint to our predefined config.
          /* options: {
            configFile: path.join(__dirname, '.eslintrc'),
            useEslintrc: false
          }, */
          // @remove-on-eject-end
          loader: 'eslint-loader'
        }],
        include: path.resolve(__dirname, 'src')
      },
      // ** ADDING/UPDATING LOADERS **
      // The "url" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list for "url" loader.

      // "url" loader embeds assets smaller than specified size as data URLs to avoid requests.
      // Otherwise, it acts like the "file" loader.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
          /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/
        ],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader'
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: function () {
                return [
                  // Inline imports (eg. support @import from node_modules)
                  require('postcss-import'),
                  /* require('postcss-url'),/*({
                    url: 'copy',
                    from: path.join(BASE_DIR, 'src/fonts/fonts.css'),
                    to: path.join(BASE_DIR, 'dist/style.css'),
                  }), */
                  require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        variables: theme.vars
                      },
                      customMedia: {
                        extensions: theme.media
                      },
                      customSelector: {
                        extensions: theme.selector
                      }
                    },
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9' // React doesn't support IE8 anyway
                    ]
                  })
                ]
              }
            }
          }
        ]
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file?name=fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.json']
  },
  devtool: 'cheap-module-source-map', // 'cheap-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true
    })
  ]
}
