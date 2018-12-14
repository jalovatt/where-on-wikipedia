'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanCollection = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  submitDate: {
    type: Date,
    required: true
  },
  submittedBy: {
    type: String,
    required: true
  }
});

var model = _mongoose2.default.model('Project', ProjectSchema);
var cleanCollection = exports.cleanCollection = function cleanCollection() {
  return model.deleteMany({}).exec();
};
exports.default = model;