const R = require('ramda')

let square = n => n * n
let arr = R.map(square, [4, 8]) // 多参数写法
let arr2 = R.map(square)([2, 4])// 单参数
console.log(arr, arr2)

// 判断第一个参数是否大于第二个参数。
console.log(R.gt(2)(1))
// 判断第一个参数是否大于等于第二个参数。
console.log(R.gte(2)(2))
// 判断第一个参数是否大于等于第二个参数。
console.log(R.gte('a')('a'))
// 比较两个值是否相等（支持对象的比较）。
console.log(R.equals([1, 2])([1, 2, 3]))
console.log(R.equals({a: 2})({b: 2}))
console.log(R.equals({v: {}})({v: {}}))
// 比较两个值传入指定函数的运算结果是否相等。
console.log(R.eqBy(Math.abs, 5)(-5))

// 返回第一个参数减第二个参数的差。
console.log(R.subtract(10)(8))
// 返回两个值的积。
console.log(R.multiply(2)(5))
// 返回第一个参数除以第二个参数的商。
console.log(R.divide(71)(100))

// 将多个函数合并成一个函数，从右到左执行
console.log(R.compose(Math.abs, R.add(1), R.multiply(2))(-4))

// 将多个函数合并成一个函数，从左到右执行。
var negative = x => -1 * x
var increaseOne = x => x + 1
var f = R.pipe(Math.pow, negative, increaseOne)
f(3, 4) // -80

// 接受两个参数，第一个参数是函数，第二个参数是函数数组。传入的值先使用第二个参数包含的函数分别处理以后，再用第一个参数处理前一步生成的结果。
var toUpperCase = s => s.toUpperCase()
var toLowerCase = s => s.toLowerCase()
var strangeConcat = R.converge(R.concat, [toUpperCase, toLowerCase])
strangeConcat('Yodel') // "YODELyodel"
