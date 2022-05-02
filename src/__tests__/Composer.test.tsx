import renderer from 'react-test-renderer'
import { Composer } from '../EasyChat'

it('should render <Composer /> and compare with snapshot', () => {
  const tree = renderer.create(<Composer />).toJSON()

  expect(tree).toMatchSnapshot()
})
