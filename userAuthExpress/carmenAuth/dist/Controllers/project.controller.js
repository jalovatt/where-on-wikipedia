'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _project = require('../models/project.model');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProjectController = function () {
    function ProjectController() {
        _classCallCheck(this, ProjectController);
    }

    _createClass(ProjectController, [{
        key: 'add',
        value: async function add(req, res) {
            if (req.user && req.user.username) {
                var newProject = new _project2.default({
                    title: req.body.title,
                    summary: req.body.summary,
                    description: req.body.description,
                    submitDate: req.body.submitDate,
                    submittedBy: req.user.username
                });
                try {
                    var result = await newProject.save();
                    res.json({ success: true, msg: 'New project is created successfully.' });
                } catch (err) {
                    return res.json({ success: false, msg: 'Save project failed.' });
                }
            } else {
                return res.status(403).send({ success: false, msg: 'Unauthorized.' });
            }
        }
    }, {
        key: 'get',
        value: async function get(req, res) {
            if (req.user && req.user.username) {
                try {
                    var projects = await _project2.default.find({ submittedBy: req.user.username }).lean().exec();
                    return res.json(projects);
                } catch (err) {
                    return next(err);
                }
            } else {
                return res.status(403).send({ success: false, msg: 'Unauthorized.' });
            }
        }
    }]);

    return ProjectController;
}();

exports.default = new ProjectController();
module.exports = exports.default;