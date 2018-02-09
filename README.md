# react-easy-sortable

Sortable list component with react that should be easy to use :tada::tada::tada:

[![npm version](https://badge.fury.io/js/react-easy-sortable.svg)](https://badge.fury.io/js/react-easy-sortable)

## Installation

Using npm:

```shell
npm install react-easy-sortable --save
```

## Usage

```js
import { SortableList, SortableItem } from 'react-easy-sortable'

export default class SortableComponent {
  onSort (target, indexList) {
    // ...
  }

  render () {
    return (
      <SortableList onSort={this.onSort.bind(this)}>
        <SortableItem>
          Your Components
        </SortableItem>
        { /* ... */ }
      </SortableList>
    )
  }
}
```

Using [Webpack](https://webpack.js.org/) or other module bunlder to pack it.
