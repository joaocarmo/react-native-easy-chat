import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { MessageImage } from '../EasyChat'
import { IMessage } from '../Models'

export const DEFAULT_TEST_MESSAGE: IMessage = {
  _id: 'test',
  text: 'test',
  user: { _id: 'test' },
  createdAt: new Date(2022, 3, 17),
}

describe('MessageImage', () => {
  it('should not render <MessageImage /> and compare with snapshot', () => {
    const tree = renderer.create(<MessageImage />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should  render <MessageImage /> and compare with snapshot', () => {
    const tree = renderer
      .create(
        <MessageImage
          currentMessage={{
            ...DEFAULT_TEST_MESSAGE,
            image: 'url://to/image.png',
          }}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
