import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { SortableList, SortableItem } from '../src'
import './index.css'

storiesOf('react-easy-sortable', module)
  .add('vertical', () => (
    <SortableList onSort={action('onSort')}>
      <SortableItem className='box'>
        0
      </SortableItem>
      <SortableItem className='box'>
        1
      </SortableItem>
      <SortableItem className='box'>
        2
      </SortableItem>
      <SortableItem className='box'>
        3
      </SortableItem>
      <SortableItem className='box'>
        4
      </SortableItem>
    </SortableList>
  ))
  .add('horizontal', () => (
    <SortableList onSort={action('onSort')}>
      <SortableItem className='box horizontal'>
        0
      </SortableItem>
      <SortableItem className='box horizontal'>
        1
      </SortableItem>
      <SortableItem className='box horizontal'>
        2
      </SortableItem>
      <SortableItem className='box horizontal'>
        3
      </SortableItem>
      <SortableItem className='box horizontal'>
        4
      </SortableItem>
    </SortableList>
  ))
