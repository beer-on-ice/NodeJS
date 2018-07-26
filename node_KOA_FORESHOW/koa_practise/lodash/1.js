const _ = require('lodash')
let arr
let arr1 = [1, 2, 3, 4, 5]

// 拆分数组，第二个参数是每个数组区块长度
arr = _.chunk(arr1, 2)
console.log(arr)

let arr2 = [1, false, '', 3]
arr = _.compact(arr2)
console.log(arr)
