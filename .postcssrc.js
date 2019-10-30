module.exports = ({ options, env }) => ({
    plugins: {
        autoprefixer: env === 'production' ? { env: 'production', grid: 'autoplace' } : false,
        cssnano: env === 'production' ? options.cssnano : false,
        'postcss-short': require('postcss-short')({
            size: {
                skip: '*'
            }
        }),
        'postcss-px-to-viewport': {
            viewportWidth: 1000,
            viewportUnit: 'vw',
            selectorBlackList: [
                '.range-slider',
                '.pin',
                '.wavebars',
                '.wavebars-bar--1',
                '.wavebars-bar--2',
                '.wavebars-bar--3',
                '.wavebars-bar--4'
            ]
        }
    }
});
