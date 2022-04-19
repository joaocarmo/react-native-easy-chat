import { Component } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Keyboard } from 'react-native'
import type {
  // ColorValue,
  EmitterSubscription,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'

import Composer from './Composer'
import Send from './Send'
import Actions from './Actions'
import Color from './Color'
import { StylePropType } from './utils/utils'

type ColorValue = any

export interface InputToolbarProps {
  accessoryStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPressActionButton?(): void
  options?: Record<string, any>
  optionTintColor?: string
  placeholderTextColor?: ColorValue
  primaryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps): ReactNode
  renderActions?(props: Actions['props']): ReactNode
  renderComposer?(props: Composer['props']): ReactNode
  renderSend?(props: Send['props']): ReactNode
  textInputStyle?: TextInputProps['style']
  textStyle?: StyleProp<TextStyle>
}

class InputToolbar extends Component<InputToolbarProps, { position: string }> {
  static defaultProps = {
    accessoryStyle: {},
    containerStyle: {},
    onPressActionButton: () => null,
    options: undefined,
    optionTintColor: undefined,
    placeholderTextColor: undefined,
    primaryStyle: {},
    renderAccessory: null,
    renderActions: null,
    renderComposer: null,
    renderSend: null,
    textInputStyle: undefined,
    textStyle: undefined,
  }

  static propTypes = {
    accessoryStyle: StylePropType,
    containerStyle: StylePropType,
    onPressActionButton: PropTypes.func,
    primaryStyle: StylePropType,
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderComposer: PropTypes.func,
    renderSend: PropTypes.func,
  }

  keyboardWillShowListener?: EmitterSubscription = undefined

  keyboardWillHideListener?: EmitterSubscription = undefined

  constructor(props: InputToolbarProps) {
    super(props)

    this.state = {
      position: 'absolute',
    }
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    )

    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    )
  }

  componentWillUnmount() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove()
    }

    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove()
    }
  }

  keyboardWillShow = () => {
    const { position } = this.state

    if (position !== 'relative') {
      this.setState({
        position: 'relative',
      })
    }
  }

  keyboardWillHide = () => {
    const { position } = this.state

    if (position !== 'absolute') {
      this.setState({
        position: 'absolute',
      })
    }
  }

  renderActions() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, renderActions, onPressActionButton, ...props } =
      this.props

    if (typeof renderActions === 'function') {
      return renderActions(props)
    }

    if (onPressActionButton) {
      return <Actions onPressActionButton={onPressActionButton} {...props} />
    }

    return null
  }

  renderSend() {
    const { renderSend, ...props } = this.props

    if (typeof renderSend === 'function') {
      return renderSend(props)
    }

    return <Send {...props} />
  }

  renderComposer() {
    const { renderComposer, ...props } = this.props

    if (typeof renderComposer === 'function') {
      return renderComposer(props)
    }

    return <Composer {...props} />
  }

  renderAccessory() {
    const { accessoryStyle, renderAccessory, ...props } = this.props

    if (typeof renderAccessory === 'function') {
      return (
        <View style={[styles.accessory, accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )
    }
    return null
  }

  render() {
    const { position } = this.state
    const { containerStyle, primaryStyle } = this.props
    const viewStyle = [
      styles.container,
      { position },
      containerStyle,
    ] as ViewStyle

    return (
      <View style={viewStyle}>
        <View style={[styles.primary, primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
})

export default InputToolbar
