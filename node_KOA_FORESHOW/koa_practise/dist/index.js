'use strict';

var _ex = require('./ex');

var _ex2 = _interopRequireDefault(_ex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { promisify } from 'util'
// import { resolve as r } from 'path'
// import {readFile, writeFileSync as wfs } from 'fs'
// import * as qs from 'querystring'

// promisify(readFile)(r(__dirname, '../package.json')).then(data => {
//   data = JSON.parse(data)
//   console.log(data.name)
//   wfs(r(__dirname, './name'), String(data.name), 'utf-8')
// })

console.log(_ex.name);
console.log((0, _ex.getName)());
console.log(_ex2.default);
console.log(_ex.test2);
//# sourceMappingURL=index.js.map