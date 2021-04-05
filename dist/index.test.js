"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _vidstreaming = _interopRequireDefault(require("./vidstreaming"));

const vid = new _vidstreaming.default('5-toubun');
test('get all episodes', () => {
  vid.episodes(false).then(results => {
    expect(Object.keys(results)).toContain('src');
  });
});