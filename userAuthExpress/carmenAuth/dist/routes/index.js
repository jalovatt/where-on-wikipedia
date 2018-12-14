'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('./index.route');

var _index2 = _interopRequireDefault(_index);

var _users = require('./users.route');

var _users2 = _interopRequireDefault(_users);

var _auth = require('./auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _project = require('./project.route');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/', _index2.default);
router.use('/users', _users2.default);
router.use('/api/auth', _auth2.default);
router.use('/api/project', _project2.default);

exports.default = router;
module.exports = exports.default;