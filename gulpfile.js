const path = require('path');
const { task, src, series, dest } = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const isDev = process.env.NODE_ENV === 'development';
const distPath = path.join(__dirname, 'dist');
const vendors = 'assets/vendors/';
const vendorPath = path.join(distPath, vendors);

const vendorFileAlias = [
    {
        path: 'moment/min',
        prod: 'moment.min.js'
    },
    {
        path: 'moment/locale',
        prod: 'zh-cn.js'
    },
    {
        path: 'redux/dist',
        dev: 'redux.js',
        prod: 'redux.min.js'
    },
    {
        path: 'redux-saga/dist',
        dev: 'redux-saga.umd.js',
        prod: 'redux-saga.umd.min.js'
    },
    {
        path: 'react/umd',
        dev: 'react.development.js',
        prod: 'react.production.min.js'
    },
    {
        path: '@hot-loader/react-dom/umd',
        dev: 'react-dom.development.js',
        prod: 'react-dom.production.min.js'
    },
    {
        path: 'react-router-dom/umd',
        dev: 'react-router-dom.js',
        prod: 'react-router-dom.min.js'
    },
    {
        path: 'react-redux/dist',
        dev: 'react-redux.js',
        prod: 'react-redux.min.js'
    }
];
const fileName = {
    moment: 'moment.min.js',
    redux: isDev ? 'redux-all.development.js' : 'redux-all.production.js',
    react: isDev ? 'react-all.development.js' : 'react-all.production.js'
};

const copyVendorFiles = vendorFileAlias.map(f => {
    const filePath = isDev && f.dev ? `${f.path}/${f.dev}` : `${f.path}/${f.prod}`;
    return path.join(__dirname, 'node_modules', filePath);
});

task('clean:vendors', function() {
    return src(vendorPath, { allowEmpty: true }).pipe(clean({ force: true }));
});

task('concat:react', function() {
    return src(copyVendorFiles.filter(f => /react/g.test(f)), { allowEmpty: true })
        .pipe(concat(fileName.react))
        .pipe(dest(vendorPath));
});
task('concat:redux', function() {
    return src(copyVendorFiles.filter(f => /redux/g.test(f) && !f.includes('react')), { allowEmpty: true })
        .pipe(concat(fileName.redux))
        .pipe(dest(vendorPath));
});

task('concat:moment', function() {
    return src(copyVendorFiles.filter(f => /moment/g.test(f)), { allowEmpty: true })
        .pipe(concat(fileName.moment))
        .pipe(dest(vendorPath));
});

task('clean', series('clean:vendors'));
task('copy', series('clean', 'concat:moment', 'concat:redux', 'concat:react'));

const vendorFiles = Object.keys(fileName).map(k => `${vendors}${fileName[k]}`);

exports.vendorFiles = vendorFiles;
