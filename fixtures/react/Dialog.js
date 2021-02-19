import React from 'react'

function Dialog(props) {
  const { Step1, Step2 } = props
  return (
    <div>
      <Step1 />
      <div>
        <label>姓名</label>
        <input />
      </div>
      <div>
        <label>年龄</label>
        <input />
      </div>
      <Step2 />
      <div>
        <button>确认</button>
      </div>
    </div>
  )
}
export default Dialog