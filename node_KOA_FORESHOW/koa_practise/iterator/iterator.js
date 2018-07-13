// function makeIterator (arr) {
//   let nextIndex = 0
//   // 返回一个迭代器对象
//   return {
//     next: () => {
//       // next() 方法返回的结果对象
//       if (nextIndex < arr.length) {
//         return {
//           value: arr[nextIndex++],
//           done: false
//         }
//       } else { return { done: true } }
//     }
//   }
// }

// const it = makeIterator(['吃饭', '睡觉', '打豆豆'])

function * makeIterator (arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}

const it = makeIterator(['吃饭', '睡觉', '打豆豆'])

console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
