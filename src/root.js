if (process.env.NODE_ENV === 'development') {
    module.exports = require('./app.dev');
} else {
    module.exports = require('./AppContainer');
}
