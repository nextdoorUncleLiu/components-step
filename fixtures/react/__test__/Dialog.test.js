import React, { Component } from 'react'
import renderer from 'react-test-renderer'
import Dialog from '../Dialog'
import ComponentsStep from '../../../dist/main.js'
console.log(ComponentsStep)
function Mid1(props) {
  return () => {
    return (
      <div>mid1 {props ? 'true' : 'false'}</div>
    )
  }
}

function Mid2(props) {
  return () => {
    return (
      <div>mid2 {!props ? 'true' : 'false'}</div>
    )
  }
}

function HighFn(atom, attr) {
  return class extends Component {
    constructor() {
      super()
    }
    render() {
      return (
        <Dialog {...atom} />
      )
    }
  }
}
const Test1 = ComponentsStep([
  {
    label: 'Step1',
    stepItemMiddle: Mid1
  },
  {
    label: 'Step2',
    stepItemMiddle: Mid2
  }
])(HighFn, 1)
test('test container', () => {
  const component = renderer.create(
    <Test1 />
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})