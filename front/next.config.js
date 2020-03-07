const withCSS = require('@zeit/next-css');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withCSS(withBundleAnalyzer({
    distDir: '.next',
    webpack(config) {
        // console.log('config', config);
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
        ];
        if (prod) {
            plugins.push(new CompressionPlugin()); // main.js.gz
        }
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',
            module: {
                ...config.module,
                rules: [
                    ...config.module.rules,
                ],
            },
            plugins,
        }
    },
}));