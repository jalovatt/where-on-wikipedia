'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('../controllers/auth.controller');

var _auth2 = _interopRequireDefault(_auth);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', _auth2.default.signUp);
router.post('/signin', _auth2.default.signIn);

exports.default = router;
module.exports = exports.default;