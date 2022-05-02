import renderer from 'react-test-renderer'
import { MessageImage } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE } from './__fixtures__/data'

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
