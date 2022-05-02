import renderer from 'react-test-renderer'
import { Bubble } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE, DEFAULT_TEST_USER } from './__fixtures__/data'

it('should render <Bubble /> and compare with snapshot', () => {
  const tree = renderer
    .create(
      <Bubble user={DEFAULT_TEST_USER} currentMessage={DEFAULT_TEST_MESSAGE} />,
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
