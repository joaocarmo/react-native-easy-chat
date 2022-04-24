import { useEffect, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { StyleSheet, View, Keyboard } from 'react-native'
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'
import Composer from './Composer'
import type { ComposerProps } from './Composer'
import Send from './Send'
import Actions from './Actions'
import Color from './Color'
import type { IMessage } from './Models'

type ColorValue = any
type SendType = typeof Send

export interface InputToolbarProps<TMessage extends IMessage> {
  accessoryStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPressActionButton?(): void
  options?: Record<string, any>
  optionTintColor?: string
  placeholderTextColor?: ColorValue
  primaryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: InputToolbarProps<TMessage>): ReactNode
  renderActions?(props: Actions['props']): ReactNode
  renderComposer?(props: Composer['props']): ReactNode
  renderSend?(props: ComponentProps<SendType>): ReactNode
  textInputStyle?: TextInputProps['style']
  textStyle?: StyleProp<TextStyle>
}

const InputToolbar = <TMessage extends IMessage = IMessage>(
  props: InputToolbarProps<TMessage>,
) => {
  const [position, setPosition] = useState('absolute')
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => setPosition('relative'),
    )
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setPosition('absolute'),
    )
    return () => {
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])

  const { containerStyle, ...rest } = props
  const {
    accessoryStyle,
    onPressActionButton,
    primaryStyle,
    renderAccessory,
    renderActions,
    renderComposer,
    renderSend,
  } = rest

  return (
    <View style={[styles.container, { position }, containerStyle] as ViewStyle}>
      <View style={[styles.primary, primaryStyle]}>
        {renderActions?.(rest) ||
          (onPressActionButton && <Actions {...rest} />)}
        {renderComposer?.(props as ComposerProps) || <Composer {...props} />}
        {renderSend?.(props) || <Send {...props} />}
      </View>
      {renderAccessory && (
        <View style={[styles.accessory, accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )}
    </View>
  )
}

InputToolbar.defaultProps = {
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
