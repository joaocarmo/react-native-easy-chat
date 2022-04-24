import {
  Linking,
  StyleSheet,
  View,
  TextProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import ParsedText from 'react-native-parsed-text'
import Communications from 'react-native-communications'
import type { ParseShape } from 'react-native-parsed-text'
import { LeftRightStyle, IMessage } from './Models'
import { useChatContext } from './EasyChatContext'
import { error } from './utils/logging'
import {
  MESSAGE_DEFAULT_OPTION_TITLES,
  TEXT_DEFAULT_POSITION,
} from './Constant'

const WWW_URL_PATTERN = /^www\./i

const textDefaultStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
}

export interface MessageTextProps<TMessage extends IMessage> {
  position?: 'left' | 'right'
  optionTitles?: string[]
  currentMessage?: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  linkStyle?: LeftRightStyle<TextStyle>
  textProps?: TextProps
  customTextStyle?: StyleProp<TextStyle>
  parsePatterns?(linkStyle: TextStyle): ParseShape[]
}

const onEmailPress = (email: string) =>
  Communications.email([email], null, null, null, null)

const MessageText = <TMessage extends IMessage = IMessage>({
  currentMessage,
  optionTitles,
  position: positionProp,
  containerStyle,
  textStyle,
  linkStyle: linkStyleProp,
  customTextStyle,
  parsePatterns = () => [],
  textProps,
}: MessageTextProps<TMessage>) => {
  const { actionSheet } = useChatContext()

  const position = positionProp || TEXT_DEFAULT_POSITION

  // TODO: React.memo
  // const shouldComponentUpdate = (nextProps: MessageTextProps<TMessage>) => {
  //   return (
  //     !!currentMessage &&
  //     !!nextProps.currentMessage &&
  //     currentMessage.text !== nextProps.currentMessage.text
  //   )
  // }

  const onUrlPress = (url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      onUrlPress(`https://${url}`)
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          error('No handler for URL:', url)
        } else {
          Linking.openURL(url)
        }
      })
    }
  }

  const onPhonePress = (phone: string) => {
    const options =
      optionTitles && optionTitles.length > 0
        ? optionTitles.slice(0, 3)
        : MESSAGE_DEFAULT_OPTION_TITLES
    const cancelButtonIndex = options.length - 1
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true)
            break
          case 1:
            Communications.text(phone)
            break
          default:
            break
        }
      },
    )
  }

  const linkStyle = [
    styles[position].link,
    linkStyleProp && linkStyleProp[position],
  ]
  return (
    <View
      style={[
        styles[position].container,
        containerStyle && containerStyle[position],
      ]}
    >
      <ParsedText
        style={[
          styles[position].text,
          textStyle && textStyle[position],
          customTextStyle,
        ]}
        parse={[
          ...parsePatterns!(linkStyle as TextStyle),
          { type: 'url', style: linkStyle, onPress: onUrlPress },
          { type: 'phone', style: linkStyle, onPress: onPhonePress },
          { type: 'email', style: linkStyle, onPress: onEmailPress },
        ]}
        childrenProps={{ ...textProps }}
      >
        {currentMessage!.text}
      </ParsedText>
    </View>
  )
}

MessageText.defaultProps = {
  position: 'left',
  optionTitles: MESSAGE_DEFAULT_OPTION_TITLES,
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  customTextStyle: {},
  textProps: {},
  parsePatterns: () => [],
}

const styles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textDefaultStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textDefaultStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
}

export default MessageText
