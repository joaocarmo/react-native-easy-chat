import renderer from 'react-test-renderer'
import { Message } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE, DEFAULT_TEST_USER } from './__fixtures__/data'

describe('Message component', () => {
  it('should render <Message /> and compare with snapshot', () => {
    const tree = renderer
      .create(
        <Message
          key="123"
          user={DEFAULT_TEST_USER}
          currentMessage={DEFAULT_TEST_MESSAGE}
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should NOT render <Message />', () => {
    const tree = renderer
      .create(
        <Message key="123" user={DEFAULT_TEST_USER} currentMessage={null} />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render <Message /> with Avatar', () => {
    const tree = renderer
      .create(
        <Message
          key="123"
          user={DEFAULT_TEST_USER}
          currentMessage={DEFAULT_TEST_MESSAGE}
          showUserAvatar
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render null if user has no Avatar', () => {
    const tree = renderer
      .create(
        <Message
          key="123"
          user={DEFAULT_TEST_USER}
          currentMessage={DEFAULT_TEST_MESSAGE}
          showUserAvatar
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
