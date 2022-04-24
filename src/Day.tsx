import { StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'
import Color from './Color'
import { isSameDay } from './utils/utils'
import { DATE_FORMAT } from './Constant'
import type { IMessage } from './Models'
import { useChatContext } from './EasyChatContext'

export interface DayProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  dateFormat?: string
}

const Day = <TMessage extends IMessage = IMessage>({
  dateFormat = DATE_FORMAT,
  currentMessage,
  previousMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: DayProps<TMessage>) => {
  const { getLocale } = useChatContext()

  if (currentMessage == null || isSameDay(currentMessage, previousMessage)) {
    return null
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>
          {dayjs(currentMessage.createdAt)
            .locale(getLocale())
            .format(dateFormat)}
        </Text>
      </View>
    </View>
  )
}

Day.defaultProps = {
  currentMessage: {
    createdAt: null,
  },
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  dateFormat: DATE_FORMAT,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600',
  },
})

export default Day
