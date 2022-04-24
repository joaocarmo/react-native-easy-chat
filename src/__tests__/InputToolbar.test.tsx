import renderer from 'react-test-renderer'
import { InputToolbar } from '../EasyChat'

jest.useFakeTimers()

it('should render <InputToolbar /> and compare with snapshot', () => {
  const tree = renderer.create(<InputToolbar />).toJSON()

  expect(tree).toMatchSnapshot()
})
