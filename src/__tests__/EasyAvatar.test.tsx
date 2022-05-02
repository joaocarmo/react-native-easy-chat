import renderer from 'react-test-renderer'
import { EasyAvatar } from '../EasyChat'

it('should render <EasyAvatar /> and compare with snapshot', () => {
  const tree = renderer.create(<EasyAvatar />).toJSON()

  expect(tree).toMatchSnapshot()
})
