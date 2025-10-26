const { merge } = require('webpack-merge'),
      commonConfig = require('./webpack.common.js'),
      TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(commonConfig, {
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        emitOnErrors: false,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false, // Keep console for debugging; set to true to remove
                        passes: 2, // Run compression twice for better results
                    },
                    output: {
                        comments: false, // Remove comments
                    },
                },
                extractComments: false,
            }),
        ],
        moduleIds: 'deterministic', // Better long-term caching
        runtimeChunk: 'single', // Extract webpack runtime into separate chunk
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // Separate vendor bundle for better caching
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true,
                },
                // Common code shared across multiple chunks
                common: {
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        },
        usedExports: true, // Tree shaking
        concatenateModules: true, // Module concatenation for smaller bundles
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 512000, // 500 KB
        maxEntrypointSize: 512000,
    },
});
