// 新建 test.js

// 引入我们的 MyPromise.js
const MyPromise = require('./promise')
const promise = new MyPromise((resolve, reject) => {
  // settimeout
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

// promise.then(
//   (value) => {
//     console.log(1);
//     console.log('resolve', value)
//   },
//   (reason) => {
//     console.log('reject', reason)
//   }
// )
// promise.then(value => {
//   console.log(2)
//   console.log('resolve', value)
// })

// promise.then(value => {
//   console.log(3)
//   console.log('resolve', value)
// })

// 链式调用
function other () {
  return new MyPromise((resolve, reject) =>{
    resolve('other')
  })
}

promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})

// 执行结果：resolve success
