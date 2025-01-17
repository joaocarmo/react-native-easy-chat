import { StyleSheet, Text, View } from 'react-native'
import type { ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'
import Color from './Color'
import { TIME_FORMAT, TIME_DEFAULT_POSITION } from './Constant'
import type { LeftRightStyle, IMessage } from './Models'
import { useChatContext } from './EasyChatContext'

const containerDefaultStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 5,
}

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
}

export interface TimeProps<TMessage extends IMessage> {
  position?: 'left' | 'right'
  currentMessage: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  timeTextStyle?: LeftRightStyle<TextStyle>
  timeFormat?: string
}

const Time = <TMessage extends IMessage = IMessage>({
  position: positionProp,
  containerStyle,
  currentMessage,
  timeFormat,
  timeTextStyle,
}: TimeProps<TMessage>) => {
  const { getLocale } = useChatContext()
  const position = positionProp || TIME_DEFAULT_POSITION

  if (currentMessage == null) {
    return null
  }

  return (
    <View
      style={[
        styles[position].container,
        containerStyle && containerStyle[position],
      ]}
    >
      <Text
        style={
          [
            styles[position].text,
            timeTextStyle && timeTextStyle[position],
          ] as TextStyle
        }
      >
        {dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)}
      </Text>
    </View>
  )
}

Time.defaultProps = {
  position: TIME_DEFAULT_POSITION,
  containerStyle: undefined,
  timeFormat: TIME_FORMAT,
  timeTextStyle: undefined,
}

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerDefaultStyle,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerDefaultStyle,
    },
    text: {
      color: Color.white,
      ...textStyle,
    },
  }),
}

export default Time
