'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('../config/db');

var _db2 = _interopRequireDefault(_db);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwt = require('jsonwebtoken');

var Auth = function () {
  function Auth() {
    _classCallCheck(this, Auth);
  }

  _createClass(Auth, [{
    key: 'signUp',
    value: function signUp(req, res) {
      if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
      } else {
        var newUser = new _user2.default({
          username: req.body.username,
          password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
          if (err) {
            return res.json({ success: false, msg: 'Username already exists.' });
          }
          res.json({ success: true, msg: 'Successful created new user.' });
        });
      }
    }
  }, {
    key: 'signIn',
    value: function signIn(req, res) {
      _user2.default.findOne({
        username: req.body.username
      }, function (err, user) {
        if (err) throw err;

        if (!user) {
          res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
          // check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // if user is found and password is right create a token
              var token = jwt.sign(user.toJSON(), _db2.default.secret, { expiresIn: '30m' });
              // return the information including token as JSON
              res.json({ success: true, token: 'JWT ' + token });
            } else {
              res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
          });
        }
      });
    }
  }]);

  return Auth;
}();

exports.default = new Auth();
module.exports = exports.default;