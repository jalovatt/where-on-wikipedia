'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _db = require('../config/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// get db config file

var passportManager = function () {
    function passportManager() {
        _classCallCheck(this, passportManager);
    }

    _createClass(passportManager, [{
        key: 'initialize',
        value: function initialize() {
            var opts = {
                jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
                secretOrKey: _db2.default.secret
            };
            _passport2.default.use(new _passportJwt.Strategy(opts, function (jwt_payload, done) {
                _user2.default.findOne({ id: jwt_payload.id }, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }));
            return _passport2.default.initialize();
        }
    }, {
        key: 'authenticate',
        value: function authenticate(req, res, next) {
            _passport2.default.authenticate('jwt', { session: false }, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    if (info.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Your token has expired." });
                    } else {
                        return res.status(401).json({ message: info.message });
                    }
                }
                req.user = user;
                return next();
            })(req, res, next);
        }
    }]);

    return passportManager;
}();

exports.default = new passportManager();
module.exports = exports.default;