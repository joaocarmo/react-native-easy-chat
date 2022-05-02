import renderer from 'react-test-renderer'
import { Avatar } from '../EasyChat'

it('should render <Avatar /> and compare with snapshot', () => {
  const tree = renderer
    .create(<Avatar renderAvatar={() => 'renderAvatar'} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
