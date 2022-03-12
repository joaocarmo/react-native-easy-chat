import PropTypes from 'prop-types'
import React from 'react'
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
import { error, StylePropType } from './utils'
import { DEFAULT_OPTION_TITLES } from './Constant'

const WWW_URL_PATTERN = /^www\./i

const textDefaultStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
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

export interface MessageTextProps<TMessage extends IMessage> {
  position: 'left' | 'right'
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

class MessageText<TMessage extends IMessage = IMessage> extends React.Component<
  MessageTextProps<TMessage>
> {
  static contextTypes = {
    actionSheet: PropTypes.func,
  }

  static defaultProps = {
    position: 'left',
    optionTitles: DEFAULT_OPTION_TITLES,
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

  static propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    textStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    linkStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    parsePatterns: PropTypes.func,
    textProps: PropTypes.object,
    customTextStyle: StylePropType,
  }

  shouldComponentUpdate(nextProps: MessageTextProps<TMessage>) {
    const { currentMessage } = this.props

    return (
      !!currentMessage &&
      !!nextProps.currentMessage &&
      currentMessage.text !== nextProps.currentMessage.text
    )
  }

  onUrlPress = (url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`)
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

  onPhonePress = (phone: string) => {
    const { actionSheet } = this.context
    const { optionTitles } = this.props

    const options =
      optionTitles && optionTitles.length > 0
        ? optionTitles.slice(0, 3)
        : DEFAULT_OPTION_TITLES
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

  render() {
    const {
      containerStyle,
      currentMessage,
      customTextStyle,
      linkStyle,
      parsePatterns,
      position,
      textProps,
      textStyle,
    } = this.props

    const enhancedlinkStyle = [
      styles[position].link,
      linkStyle && linkStyle[position],
    ] as TextStyle

    const parsedPatterns =
      typeof parsePatterns === 'function'
        ? parsePatterns(enhancedlinkStyle)
        : []

    const message = currentMessage?.text || ''

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
            ...parsedPatterns,
            { type: 'url', style: enhancedlinkStyle, onPress: this.onUrlPress },
            {
              type: 'phone',
              style: enhancedlinkStyle,
              onPress: this.onPhonePress,
            },
            { type: 'email', style: enhancedlinkStyle, onPress: onEmailPress },
          ]}
          childrenProps={{ ...textProps }}
        >
          {message}
        </ParsedText>
      </View>
    )
  }
}

export default MessageText
