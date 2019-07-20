const path = require('path');
const webpack = require('webpack');
const vendorFiles = require('./gulpfile').vendorFiles;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

// eslint-disable-next-line no-unused-vars
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');
const cachePath = path.join(__dirname, '.cache');
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 8181;
const API_GATEWAY = process.env.API || '//localhost:3000';
const filesNameMapper = {
    filename: isDev ? '[name].js' : 'assets/js/[name].[chunkhash:5].js',
    chunkFilename: isDev ? '[name].chunk.js' : 'assets/js/[name].[chunkhash:5].chunk.js',
    cssFilename: isDev ? '[name].css' : 'assets/css/[name].[chunkhash:5].css',
    cssChunkFilename: isDev ? '[id].css' : 'assets/css/[name].[chunkhash:5].css',
    imgFilename: 'assets/images/[name].[hash:5].[ext]'
};

// eslint-disable-next-line no-unused-vars
const isString = s => typeof s === 'string';

const plugins = [
    new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        favicon: 'public/favicon.ico',
        title: 'React Seed',
        inject: 'body',
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false
        }
    }),
    new HtmlWebpackIncludeAssetsPlugin({
        assets: vendorFiles,
        append: false,
        cssExtensions: ['.css', '.less']
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom',
        classNames: 'classnames',
        PropTypes: 'prop-types',
        delay: ['@helper', 'delay'],
        request: ['requestJs', 'default'],
        autobind: ['decoration', 'autobind'],
        safeSetState: ['decoration', 'safeSetState'],
        displayName: ['decoration', 'displayName'],
        withErrorBoundary: ['ErrorBoundary', 'withErrorBoundary']
    }),
    new MiniCssExtractPlugin({
        filename: filesNameMapper.cssFilename,
        chunkFilename: filesNameMapper.cssChunkFilename
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
];
if (isDev) {
    ;[].push.apply(plugins, [
        new webpack.NamedModulesPlugin(),
        new StyleLintPlugin({
            configFile: path.join(__dirname, '.stylelintrc'),
            files: '**/*.(le|c)ss'
        })
    ]);
} else {
    ;[].push.apply(plugins, [
        new CleanWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
        // new BundleAnalyzerPlugin({ openAnalyzer: !false })
    ]);
}

module.exports = function config() {
    return {
        mode: isDev ? 'development' : 'production',
        target: 'web',
        entry: {
            app: './src/index.jsx'
        },
        output: {
            path: distPath,
            filename: filesNameMapper.filename,
            chunkFilename: filesNameMapper.chunkFilename,
            publicPath: '/'
        },
        devServer: {
            port,
            open: !true,
            publicPath: '/',
            contentBase: path.join(__dirname, 'dist'),
            historyApiFallback: true,
            inline: true,
            disableHostCheck: true,
            https: false,
            overlay: true,
            stats: 'errors-only',
            clientLogLevel: 'error',
            proxy: {
                '/api': {
                    target: `http:${API_GATEWAY}`
                }
            }
        },
        resolve: {
            symlinks: false,
            extensions: ['.js', '.jsx', '.less', '.css'],
            modules: ['node_modules', srcPath],
            alias: {
                'react-dom': '@hot-loader/react-dom',
                '@': path.join(__dirname, 'src'),
                '@i18n': path.join(__dirname, 'src/i18n'),
                '@assets': path.join(__dirname, 'src/assets'),
                '@components': path.join(__dirname, 'src/components'),
                '@views': path.join(__dirname, 'src/views'),
                '@helper': path.join(__dirname, 'src/helper'),
                '@context': path.join(__dirname, 'src/context'),
                '@styles': path.join(__dirname, 'src/styles'),
                ErrorBoundary: path.join(__dirname, 'src/components/ErrorBoundary.jsx'),
                decoration: path.join(__dirname, 'src/helper/decoration/index.js'),
                requestJs: path.join(__dirname, 'src/helper/request/index.js')
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        {
                            loader: 'eslint-loader',
                            options: {
                                formatter: require('eslint/lib/cli-engine/formatters/stylish')
                            }
                        },
                        'source-map-loader'
                    ],
                    enforce: 'pre',
                    exclude: /(node_modules|src\/libs)/
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|src\/libs)/,
                    include: srcPath,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.join(cachePath, 'jscache')
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                extends: path.join(__dirname, '.babelrc')
                            }
                        }
                    ]
                },
                {
                    test: /\.(le|c)ss$/,
                    include: /(src\/styles|node_modules)/,
                    use: styleLoaderConfig({ useCssModule: false })
                },
                {
                    test: /\.(le|c)ss$/,
                    include: /src\/(views|components|containers|layouts)/,
                    use: styleLoaderConfig({ useCssModule: true })
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                limit: 8124,
                                name: filesNameMapper.imgFilename
                            }
                        }
                    ]
                }
            ]
        },
        resolveLoader: {
            moduleExtensions: ['-loader']
        },
        externals: {
            redux: 'Redux',
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
            'react-redux': 'ReactRedux',
            'redux-saga': 'ReduxSaga',
            moment: false
        },
        plugins,
        optimization: {
            removeAvailableModules: true,
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            minimizer: [
                new TerserPlugin({
                    cache: path.join(cachePath, 'uglifycache'),
                    sourceMap: true,
                    parallel: true,
                    terserOptions: {
                        ecma: 8,
                        output: {
                            comments: /webpackChunkName/,
                            beautify: false
                        },
                        compress: {
                            drop_console: true,
                            warnings: false,
                            conditionals: true,
                            unused: true,
                            comparisons: true,
                            sequences: true,
                            dead_code: true,
                            evaluate: true,
                            if_return: true,
                            join_vars: true
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin()
            ]
        },
        performance: {
            hints: false
        },
        cache: true,
        watch: false,
        devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map'
    };
};

function styleLoaderConfig(options = {}) {
    const cssModuleConfig = options.useCssModule ? { localIdentName: '[local]-[hash:base64:5]' } : false;
    return [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
            loader: 'cache-loader',
            options: {
                cacheDirectory: path.join(cachePath, 'csscache')
            }
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                modules: cssModuleConfig
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                config: {
                    path: './',
                    ctx: {
                        cssnano: { preset: 'default' }
                    }
                }
            }
        },
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true,
                modifyVars: {
                    '@primary-color': '#6777ef'
                }
            }
        },
        {
            loader: 'style-resources-loader',
            options: {
                patterns: path.resolve(__dirname, 'src/styles/variables.less'),
                injector: 'append'
            }
        }
    ];
}
