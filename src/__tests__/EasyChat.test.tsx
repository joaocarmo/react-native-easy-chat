import renderer from 'react-test-renderer'
import { EasyChat } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE2 } from './__fixtures__/data'

const messages = [DEFAULT_TEST_MESSAGE2]

it('should render <EasyChat/> and compare with snapshot', () => {
  const tree = renderer
    .create(
      <EasyChat
        messages={messages}
        onSend={() => null}
        user={{
          _id: 1,
        }}
      />,
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
