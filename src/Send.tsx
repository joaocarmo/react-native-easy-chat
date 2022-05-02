import type { ReactNode } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import { useCallbackOne, useMemoOne } from 'use-memo-one'
import Color from './Color'
import type { IMessage } from './Models'

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

const Send = <TMessage extends IMessage = IMessage>({
  text,
  containerStyle,
  children,
  textStyle,
  label,
  alwaysShowSend,
  disabled,
  sendButtonProps,
  onSend,
}: SendProps<TMessage>) => {
  const handleOnPress = useCallbackOne(() => {
    if (text && onSend) {
      onSend({ text: text.trim() } as Partial<TMessage>, true)
    }
  }, [text, onSend])

  const showSend = useMemoOne(
    () => alwaysShowSend || (text && text.trim().length > 0),
    [alwaysShowSend, text],
  )

  const renderSend = children ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  ) : (
    <Text style={[styles.text, textStyle]}>{label}</Text>
  )

  if (!showSend) {
    return null
  }

  return (
    <TouchableOpacity
      testID="send"
      accessible
      accessibilityLabel="send"
      style={[styles.container, containerStyle]}
      onPress={handleOnPress}
      accessibilityRole="button"
      disabled={disabled}
      {...sendButtonProps}
    >
      <View>{renderSend}</View>
    </TouchableOpacity>
  )
}

Send.defaultProps = {
  text: '',
  onSend: () => null,
  label: 'Send',
  containerStyle: undefined,
  textStyle: undefined,
  children: null,
  alwaysShowSend: false,
  disabled: false,
  sendButtonProps: null,
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
