'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'secret': 'my secret',
    'database': process.env.NODE_ENV == 'test' ? 'mongodb://localhost/rest-api-test' : 'mongodb://localhost/rest-api'
};
module.exports = exports.default;