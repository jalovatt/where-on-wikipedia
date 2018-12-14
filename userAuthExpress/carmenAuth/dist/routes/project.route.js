'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _project = require('../controllers/project.controller');

var _project2 = _interopRequireDefault(_project);

var _passport = require('../config/passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.route('/').get(_passport2.default.authenticate, _project2.default.get).post(_passport2.default.authenticate, _project2.default.add);

exports.default = router;
module.exports = exports.default;