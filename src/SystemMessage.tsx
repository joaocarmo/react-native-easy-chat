import { StyleSheet, Text, View } from 'react-native'
import type { ViewStyle, StyleProp, TextStyle } from 'react-native'
import Color from './Color'
import type { IMessage } from './Models'

export interface SystemMessageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const SystemMessage = <TMessage extends IMessage = IMessage>({
  currentMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: SystemMessageProps<TMessage>) => {
  if (currentMessage == null || currentMessage.system === false) {
    return null
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
      </View>
    </View>
  )
}

SystemMessage.defaultProps = {
  currentMessage: {
    system: false,
  },
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '300',
  },
})

export default SystemMessage
