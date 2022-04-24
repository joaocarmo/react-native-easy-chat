import renderer from 'react-test-renderer'
import { MessageContainer } from '../EasyChat'

it('should render <MessageContainer /> and compare with snapshot', () => {
  const tree = renderer.create(<MessageContainer />).toJSON()

  expect(tree).toMatchSnapshot()
})
