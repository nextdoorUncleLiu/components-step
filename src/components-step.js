/**
 * @function stepItemCallback [每一步回调]
 * @param {Object} atom [步骤输出原子]
 * @param {Object} stepItem [步骤对象]
 */
function stepItemCallback(atom, stepItem, attr) {
  /**
   * @name {String} label [步骤输出标示，用于给予容器内容内容标示]
   * @name {Element | Class | Function} stepItemMiddle [步骤中间件，用于处理步骤输出内容]
   */
  const { label, stepItemMiddle } = stepItem
  const render = stepItemMiddle(attr)
  if (typeof render === 'function' && render.constructor === Function && render instanceof Function) {
    atom[label] = stepItemMiddle(attr)
  } else {
    console.error(`${label} 的 stepItemMiddle 方法 内需要一个回调方法，用于渲染组件`)
  }
}

/**
 * @function ComponentsStep [组件步骤化入口]
 * @param {array} stepMiddleArray 中间件数组
 */
function ComponentsStep(stepMiddleArray) {
  /**
   * @param {Object | Array | Number | String} attr [步骤参数]
   * @param {Function} container [输出到的容器函数]
   * @returns {Function} [用于接收参数和容器的高阶函数]
   */
  return (container, attr) => {
    let atom = Object.create(null) // 创建原子，最后输出到容器一个原子，保证原子在改变过程中的安全性
    for(let i = 0; i < stepMiddleArray.length; ++i) {
      const stepItem = stepMiddleArray[i] // 每一步，作用于输出前的中间件部分
      stepItemCallback(atom, stepItem, attr)
    }
    return container(atom, attr)
  }
}

export default ComponentsStep
