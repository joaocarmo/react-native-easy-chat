import renderer from 'react-test-renderer'
import { SystemMessage } from '../EasyChat'
import { DEFAULT_TEST_MESSAGE } from './__fixtures__/data'

describe('SystemMessage', () => {
  it('should not render <SystemMessage /> and compare with snapshot', () => {
    const tree = renderer.create(<SystemMessage />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render <SystemMessage /> and compare with snapshot', () => {
    const tree = renderer
      .create(
        <SystemMessage
          currentMessage={{
            ...DEFAULT_TEST_MESSAGE,
            system: true,
          }}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
