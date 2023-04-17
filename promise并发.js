async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [] // 用于存放所有的promise实例
  const executing = [] // 用于存放目前正在执行的promise
  for (const item of array) {
    const p = Promise.resolve(iteratorFn(item)) // 防止回调函数返回的不是promise，使用Promise.resolve进行包裹
    ret.push(p)
    if (poolLimit <= array.length) {
      // then回调中，当这个promise状态变为fulfilled后，将其从正在执行的promise列表executing中删除
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        console.log('execting', executing)
        // 一旦正在执行的promise列表数量等于限制数，就使用Promise.race等待某一个promise状态发生变更，
        // 状态变更后，就会执行上面then的回调，将该promise从executing中删除，
        // 然后再进入到下一次for循环，生成新的promise进行补充
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

const timeout = (i) => {
  console.log('开始', i)
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(i)
      console.log('结束', i)
    }, i)
  )
}

;(async () => {
  const res = await asyncPool(2, [1000, 5000, 3000, 2000], timeout)
  console.log(res)
})()

// -------------------- 手写并发模式 ----------------------
async function MyasyncPool(limit, array, callback) {
  const executing = []
  const allTask = []
  for(let item of array) {
    // 防止callback不是promise对象，使用promise.resolve包装一层
    const p = Promise.resolve(callback(item))
    allTask.push(p)
    if(array.length >= limit) {
      const e = p.then(()=>{
        // 当前promise执行完成后，从executing数组中删除。
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if(executing.length >= limit) {
        // 执行executing函数中的所有promise
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(allTask)
}
;(async () => {
  const res = await MyasyncPool(2, [1000, 5000, 3000, 2000], timeout)
  console.log(res)
})()
