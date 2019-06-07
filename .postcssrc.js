const autoprefixer = require('autoprefixer');

module.exports = ({ options, env }) => ({
    plugins: {
        autoprefixer: env === 'production' ? { env: 'production', grid: 'autoplace' } : false,
        cssnano: env === 'production' ? options.cssnano : false,
        'postcss-short': require('postcss-short')({
            size: {
                skip: '*'
            }
        })
    }
});
