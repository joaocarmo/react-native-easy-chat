import { Component } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import Color from './Color'
import { IMessage } from './Models'
import { StylePropType } from './utils'

export interface SendProps<TMessage extends IMessage> {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: ReactNode
  alwaysShowSend?: boolean
  disabled?: boolean
  sendButtonProps?: Partial<TouchableOpacityProps>
  onSend?(
    messages: Partial<TMessage> | Partial<TMessage>[],
    shouldResetInputToolbar: boolean,
  ): void
}

class Send<TMessage extends IMessage = IMessage> extends Component<
  SendProps<TMessage>
> {
  static defaultProps = {
    text: '',
    onSend: () => null,
    label: 'Send',
    containerStyle: {},
    textStyle: {},
    children: null,
    alwaysShowSend: false,
    disabled: false,
    sendButtonProps: null,
  }

  static propTypes = {
    text: PropTypes.string,
    onSend: PropTypes.func,
    label: PropTypes.string,
    containerStyle: StylePropType,
    textStyle: StylePropType,
    children: PropTypes.element,
    alwaysShowSend: PropTypes.bool,
    disabled: PropTypes.bool,
    sendButtonProps: PropTypes.object,
  }

  handleOnPress = () => {
    const { text, onSend } = this.props
    if (text && onSend) {
      onSend({ text: text.trim() } as Partial<TMessage>, true)
    }
  }

  render() {
    const {
      text,
      containerStyle,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
      sendButtonProps,
    } = this.props
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        <TouchableOpacity
          testID="send"
          accessible
          accessibilityLabel="send"
          style={[styles.container, containerStyle]}
          onPress={this.handleOnPress}
          accessibilityTraits="button"
          disabled={disabled}
          {...sendButtonProps}
        >
          <View>
            {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
          </View>
        </TouchableOpacity>
      )
    }
    return <View />
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
})

export default Send
