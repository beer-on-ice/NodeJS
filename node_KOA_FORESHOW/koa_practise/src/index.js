// import { promisify } from 'util'
// import { resolve as r } from 'path'
// import {readFile, writeFileSync as wfs } from 'fs'
// import * as qs from 'querystring'

// promisify(readFile)(r(__dirname, '../package.json')).then(data => {
//   data = JSON.parse(data)
//   console.log(data.name)
//   wfs(r(__dirname, './name'), String(data.name), 'utf-8')
// })

import {name} from './ex'
import {getName} from './ex'
import ageeee from './ex'
import {
  test2 as test3
} from './ex'

console.log(name)
console.log(getName())
console.log(ageeee)
console.log(test3)
