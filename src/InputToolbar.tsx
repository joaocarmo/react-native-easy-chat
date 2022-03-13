import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  EmitterSubscription,
  StyleProp,
  ViewStyle,
} from 'react-native'

import Composer from './Composer'
import Send from './Send'
import Actions from './Actions'
import Color from './Color'
import { StylePropType } from './utils'

export interface InputToolbarProps {
  options?: Record<string, any>
  optionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps): React.ReactNode
  renderActions?(props: Actions['props']): React.ReactNode
  renderSend?(props: Send['props']): React.ReactNode
  renderComposer?(props: Composer['props']): React.ReactNode
  onPressActionButton?(): void
}

class InputToolbar extends React.Component<
  InputToolbarProps,
  { position: string }
> {
  static defaultProps = {
    options: undefined,
    optionTintColor: undefined,
    renderAccessory: null,
    renderActions: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    onPressActionButton: () => null,
  }

  static propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: StylePropType,
    primaryStyle: StylePropType,
    accessoryStyle: StylePropType,
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
