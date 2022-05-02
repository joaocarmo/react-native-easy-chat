import renderer from 'react-test-renderer'
import { Actions } from '../EasyChat'

it('should render <Actions /> and compare with snapshot', () => {
  const tree = renderer.create(<Actions />).toJSON()

  expect(tree).toMatchSnapshot()
})
