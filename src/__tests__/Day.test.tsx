import renderer from 'react-test-renderer'
import { Day } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE } from './__fixtures__/data'

describe('Day', () => {
  it('should not render <Day /> and compare with snapshot', () => {
    const component = renderer.create(<Day />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render <Day /> and compare with snapshot', () => {
    const component = renderer.create(
      <Day currentMessage={DEFAULT_TEST_MESSAGE} />,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
