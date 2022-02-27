import 'react-native'
import React from 'react'
import createComponentWithContext from './context'

import { Time } from '../EasyChat'

it('should render <Time /> and compare with snapshot', () => {
  const component = createComponentWithContext(<Time />)
  const tree = component.toJSON()

  expect(tree).toMatchSnapshot()
})
