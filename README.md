这不是一个框架，也不是一个工具，只是一个提升开发效率、代码可读性、代码可易维护性的一种基于 `组件化开发` 的一种新的思路，我称之为 `组件步骤化`

## 安装

npm

```js
npm install --save components-step
```

yarn

```js
yarn add components-step
```
## 使用方式

```js
import ComponentsStep from 'components-step'

ComponentsStep([mid1,mid2])(container, attr)
```

## 简介

在多年的开发经验过程中，目前存在的已知的开发模式并不能满足我的所有需求，`组件化开发` 和 `代码的复用性` 可以满足我大部分工作的模式，但是遇到很多繁琐而又复杂的需求，它们并不能为我提供我想达到的预期效果：

同一个功能（页面）中，基于部分功能是一致的，例如有一个弹框，里面有 2 个公共的弹窗，姓名 和 年龄，对于该用户信息的操作，对于不同的页面内，我们会有不同的数据处理，但是都是存在一个用户的数据表内，所以我们请求的接口也是一个的，这个时候我们把它封装起来，写成一个组件：

```下面所有的片段代码都是伪代码，讲解大概的一个讲解一下案例，切勿当作实际代码跑demo```

```js
function Dialog(props) {
  function submit() {
    fetch({
      url: 'save',
      method: 'post',
      data: {
        // 所有的参数
      }
    })
  }
  const { children } = props
  return (
    <div>
      <div>
        <label>姓名</label>
        <input />
      </div>
      <div>
        <label>年龄</label>
        <input />
      </div>
      {children}
      <div>
        <button onclick="submit">确认</button>
      </div>
    </div>
  )
}
```

这样我们就可以在不同的页面中放置的去使用了，通过 chilren 把对应的其他类别的条件放进来，反正请求的是一个接口也是没有必要剥离的

这时我们可能有 3 个页面要用这个组件，其中一个页面需要添加一个 `年龄` 的文本框、一个需要添加 `年龄`、`职业` 的文本框，还有一个是需要添加一个 `籍贯` 的文本框，我们发现有部分功能是重复的是可以复用的就是 `年龄` 文本框，我们想办法把它剥离出来写成单独的一个组件去调用

```当然实际项目当中，不只是只有一个文本框这么简单，可能不同的下拉框都会有不同的逻辑判断，然而功能的目的地都是相同的，不剥离写n份，不易于维护，剥离写一份，嵌套地狱就是这样产生了```

## 想法的诞生

基于上述的条件下我在考虑如何把这个事情给完美的解决掉，看问题要发现问题的本质才能更好的去解决问题，这种情况下我认为问题的根源是在过程，使用的页面或者输出的接口都是统一的，这里我们称之为 `入口` 和 `出口`

结合我多年以来我了解的知识面并结合这样的业务场景我想到了一种解决办法，是不是可以通过中间件的模式去解决这种问题呢？

入口 -> 中间件（第一步处理、第二步处理....） -> 出口

问题定位到了，解决方法想出来了，接下来就是解决问题了

## components-step 模式

这种模式我之所以称之为 `组件步骤化` 是我觉得它做事情是一步一步来的，下一步的动作永远都是基于上一步的，保证了输入输出的稳定性，前面称呼为中间件的原因是通过中间件这个概念来去了解 `组件步骤化` 可能会更快和更方便一些，毕竟，这是一种开发模式，而不是一个功能

基于上面我所描述的需求，我们通过 `组件步骤化` 做一下处理：

### 解决冗余代码

首先，我们肯定要保证的问题就是，如何让我们的代码不重复的，解决重复的代码，是我们要做的第一步：

```js
function Mid1(props) {
  console.log(props, this)
  return () => {
    console.log(this)
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
```

假设上面的方法就是我们那些在不同的条件下，重复的逻辑我们把他剥离出来，这里的写法和我们平时有一点的不同是多了一层的 `return` 这里我还没有构思好，但是我留出来的目的是为了可能后期这里会做中间件处理

这样不同的可以剥离出来，那么我们相同的代码就可以不用在写两遍了，这是我们要做的第一步

### 基于不同条件下组件渲染的灵活性

`组件步骤化` 虽然和 `中间件(middleware)` 的概念有相似之处，只不过 `中间件(middleware)` 在开发过程中起到的是一个辅助作用，而 `组件步骤化` 的每个步骤都很重要，它会直接决定我们未来的容器内，需要放置怎么样的内容呈现给用户：

```js
import ComponentsStep from 'components-step'

const step = ComponentsStep([
  {
    label: 'Step1',
    stepItemMiddle: Mid1
  },
  {
    label: 'Step2',
    stepItemMiddle: Mid2
  }
])
```

`ComponentsStep` 就是我们 `组件步骤化` 的入口，用来收集所有的步骤化的组件：

 - `label`： 每一个标示，当要在父容器内渲染时，它就是该步骤的容器
 - `stepItemMiddle`： 用做所需渲染组件的方法，返回值需要是一个 `function component`

`ComponentsStep` 返回值也是一个 `function` ，该 `function` 接收两个值，一个是 `容器(container)`，一个是 `参数(attr)`，只有调用了 `ComponentsStep` 返回的函数渲染才会执行，因为组件的渲染可能需要依赖某些条件才可以完成，容器就是我们步骤化的组件需要放置于的位置，由于组件渲染的位置是不可控的，所以我们返回的不能是一个单一的队列，这样对于我们步骤化组件的渲染并不便利

### 容器渲染的灵活性

基于上面组件化开发的需求，我们可能有相同的功能在不同的页面内做渲染，所以要把不同的页面，也就是我们的容器入口给打开，保证功能的单一性及灵活性：

```js
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
const arg = 1
step(HighFn, arg)
```

容器的灵活性直接影响到我们功能的实用性，频繁的函数调用也会影响渲染的速度，在为了保持该两个条件的情况下，我把他们放在了 `ComponentsStep` 的返回函数的参数内

`highFn` 就是所谓的 `容器(container)` ，`arg` 就是参数， `ComponentsStep` 的返回函数 `step` 调用后，`highFn` 的函数内会接收到两个参数：`步骤化组件集合（atom）` 和 `参数(attr)`