import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * 可拖动排序的单元
 *
 * @export
 * @class Item
 * @extends {Component}
 */
export class Item extends Component {}

/**
 * SortableList Component
 *
 * @class SortableList
 * @extends {Component}
 */
export class SortableList extends Component {
  /**
   * Creates an instance of SortableList.
   * @memberof SortableList
   */
  constructor (props, context) {
    super(props, context)
    this.items = []
    this.count = 0 // 重新排序时的处理顺序
    this.data = {
      dragging: false,
      current: undefined,
      list: []
    }

    this.wrap(props.children)
    this.state = {
      list: this.getListByItems()
    }
  }

  /**
   * 在子元素更新的情况下，调整 items 数据和索引列表 list
   *
   * @param {object} nextProps
   * @memberof SortableList
   */
  componentWillReceiveProps (nextProps) {
    if (this.props.children !== nextProps.children) {
            // 重置子元素，重新获取
      this.items = []
      this.wrap(nextProps.children)
      this.setState({
        list: this.getListByItems()
      })
    }
  }

  /**
   * 通过可排序的子元素生成对应的索引列表
   *
   * @returns
   * @memberof SortableList
   */
  getListByItems () {
    return new Array(this.items.length).fill(1).map((_, i) => i)
  }

  /**
   * 开始拖拽，主要获取当前拖动的元素索引
   *
   * @param {SyntheticEvent} event
   * @memberof SortableList
   */
  handleDragStart (event) {
    if (!this.data.dragging) {
      event.dataTransfer.setData('text/html', event.target)
      this.data.dragging = true
      this.data.current = event.target.getAttribute('data-index')
      this.data.list = [...this.state.list]
    }
  }

  /**
   * 拖拽时移动到其他元素，调用对应的方法重新排序
   *
   * @param {SyntheticEvent} event
   * @memberof SortableList
   */
  handleDragEnter (event) {
    const { dragging, current } = this.data
    const index = event.currentTarget.getAttribute('data-index')
    if (dragging && current !== index) {
      this.sortPosition(Number(current), Number(index))
    }
  }

  /**
   * 处理拖拽时的移动
   *
   * @param {SyntheticEvent} event
   * @memberof SortableList
   */
  handleDragOver (event) {
    event.preventDefault()
    event.dataTransfer.effectAllowed = 'move'
  }

  /**
   * 处理拖拽后放置元素
   * 调用 props.onSort 方法，重置拖拽状态数据
   *
   * @param {SyntheticEvent} event
   * @memberof SortableList
   */
  handleDrop (event) {
    event.persist()
    event.dropEffect = 'move'
    event.dataTransfer.setData('text/html', null)

    // 顺序不变时不调用 onSort
    if (
      typeof this.props.onSort === 'function' &&
      this.data.list.join('-') !== this.state.list.join('-') // 简单的数组 diff
    ) {
      this.props.onSort.call(this, event.target, this.state.list)
    }

    // 重置拖拽数据
    this.data = {
      dragging: false,
      current: undefined,
      list: []
    }
  }

  /**
   * 给列表项添加 div 外层元素，并绑定相关属性和事件，记录所有的排序元素
   *
   * @param {ReactElement[]} children
   * @returns
   * @memberof SortableList
   */
  wrap (node) {
    if (!node) {
      return
    }

    if (Array.isArray(node)) {
      node.forEach(child => this.wrap(child))
    } else if (node.type === Item) {
      const index = this.items.length
      const item = (
        <div
          {...node.props}
          key={index}
          data-index={`${index}`}
          draggable
          onDragStart={this.handleDragStart.bind(this)}
          onDragEnter={this.handleDragEnter.bind(this)}
          onDragOver={this.handleDragOver.bind(this)}
          onDrop={this.handleDrop.bind(this)}
                >
          {node.props.children}
        </div>
      )
      this.items.push(item)
    } else if (node.props && node.props.children) {
      this.wrap(node.props.children)
    }
  }

  /**
   * 根据 state.list 中保存的索引顺序重新整理子元素
   *
   * @param {ReactElement[]} children
   * @returns
   * @memberof SortableList
   */
  sort (node) {
    if (!node) {
      return null
    }

    if (Array.isArray(node)) {
      return node.map(child => this.sort(child))
    } else if (node.type === Item) {
      const index = this.state.list[this.count++]
      const item = this.items[index]
      return item
    } else if (node.props && node.props.children) {
      const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children]
      return React.cloneElement(node, node.props, ...this.sort(children))
    } else {
      return node
    }
  }

  /**
   * 根据传入的元素索引调整位置
   *
   * @param {number} x
   * @param {number} y
   *
   * @memberof SortableList
   */
  sortPosition (x, y) {
    const { list } = this.state
    const xIndex = list.indexOf(x)
    list.splice(xIndex, 1) // 先移除 x
    const yIndex = list.indexOf(y)

    if (xIndex <= yIndex) {
      list.splice(yIndex + 1, 0, x)
    } else {
      list.splice(yIndex, 0, x)
    }

    this.setState({ list })
  }

  /**
   * 渲染组件元素
   *
   * @memberOf @SortableList
   */
  render () {
    const attrs = Object.assign({}, this.props)
    delete attrs.children

    const items = this.sort(this.props.children)
    this.count = 0 // 重置计数
    delete attrs.onSort

    return (
      <div {...attrs}>
        {items}
      </div>
    )
  }
}

SortableList.propTypes = {
  onSort: PropTypes.func
}
