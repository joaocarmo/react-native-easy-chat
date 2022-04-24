import { Component } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import type { StyleProp, ViewStyle, TextStyle } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import QuickReplies from './QuickReplies'
import type { QuickRepliesProps } from './QuickReplies'
import MessageText from './MessageText'
import type { MessageTextProps } from './MessageText'
import MessageImage from './MessageImage'
import type { MessageImageProps } from './MessageImage'
import MessageVideo from './MessageVideo'
import MessageAudio from './MessageAudio'
import Time from './Time'
import type { TimeProps } from './Time'
import Color from './Color'

import { StylePropType, isSameUser, isSameDay } from './utils/utils'
import {
  User,
  IMessage,
  LeftRightStyle,
  Reply,
  Omit,
  MessageVideoProps,
  MessageAudioProps,
} from './Models'
import {
  BUBBLE_DEFAULT_OPTION_TITLES,
  BUBBLE_DEFAULT_PENDING_TICK,
  BUBBLE_DEFAULT_RECEIVED_TICK,
  BUBBLE_DEFAULT_SENT_TICK,
  BUBBLE_RENDER_USERNAME_TICK,
} from './Constant'

export type RenderMessageImageProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageImageProps<TMessage>

export type RenderMessageVideoProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageVideoProps<TMessage>

export type RenderMessageAudioProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageAudioProps<TMessage>

export type RenderMessageTextProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageTextProps<TMessage>

export interface BubbleProps<TMessage extends IMessage> {
  user?: User
  touchableProps?: object
  renderUsernameOnMessage?: boolean
  isCustomViewBottom?: boolean
  inverted?: boolean
  position: 'left' | 'right'
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  optionTitles?: string[]
  containerStyle?: LeftRightStyle<ViewStyle>
  wrapperStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  bottomContainerStyle?: LeftRightStyle<ViewStyle>
  tickStyle?: StyleProp<TextStyle>
  containerToNextStyle?: LeftRightStyle<ViewStyle>
  containerToPreviousStyle?: LeftRightStyle<ViewStyle>
  usernameStyle?: TextStyle
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  onPress?(context?: any, message?: any): void
  onLongPress?(context?: any, message?: any): void
  onQuickReply?(replies: Reply[]): void
  renderMessageImage?(props: RenderMessageImageProps<TMessage>): ReactNode
  renderMessageVideo?(props: RenderMessageVideoProps<TMessage>): ReactNode
  renderMessageAudio?(props: RenderMessageAudioProps<TMessage>): ReactNode
  renderMessageText?(props: RenderMessageTextProps<TMessage>): ReactNode
  renderCustomView?(bubbleProps: BubbleProps<TMessage>): ReactNode
  renderTime?(timeProps: TimeProps<TMessage>): ReactNode
  renderTicks?(currentMessage: TMessage): ReactNode
  renderUsername?(): ReactNode
  renderQuickReplySend?(): ReactNode
  renderQuickReplies?(quickReplies: QuickRepliesProps): ReactNode
}

class Bubble<TMessage extends IMessage = IMessage> extends Component<
  BubbleProps<TMessage>
> {
  static contextTypes = {
    actionSheet: PropTypes.func,
  }

  static defaultProps = {
    inverted: false,
    textStyle: undefined,
    quickReplyStyle: undefined,
    quickReplyTextStyle: undefined,
    renderQuickReplySend: undefined,
    isCustomViewBottom: false,
    renderUsernameOnMessage: false,
    touchableProps: {},
    onPress: null,
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageAudio: null,
    renderMessageText: null,
    renderCustomView: null,
    renderUsername: null,
    renderTicks: null,
    renderTime: null,
    renderQuickReplies: null,
    onQuickReply: null,
    position: 'left',
    optionTitles: BUBBLE_DEFAULT_OPTION_TITLES,
    currentMessage: {
      text: null,
      createdAt: null,
      image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    bottomContainerStyle: {},
    tickStyle: {},
    usernameStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageAudio: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    isCustomViewBottom: PropTypes.bool,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    renderQuickReplies: PropTypes.func,
    onQuickReply: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    wrapperStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    bottomContainerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    tickStyle: StylePropType,
    usernameStyle: StylePropType,
    containerToNextStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    containerToPreviousStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
  }

  onPress = () => {
    const { currentMessage, onPress } = this.props

    if (typeof onPress === 'function') {
      onPress(this.context, currentMessage)
    }
  }

  onLongPress = () => {
    const { actionSheet } = this.context
    const { currentMessage, onLongPress } = this.props

    if (typeof onLongPress === 'function') {
      onLongPress(this.context, currentMessage)
    } else if (currentMessage && currentMessage.text) {
      const { optionTitles } = this.props
      const options =
        optionTitles && optionTitles.length > 0
          ? optionTitles.slice(0, 2)
          : BUBBLE_DEFAULT_OPTION_TITLES
      const cancelButtonIndex = options.length - 1

      actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(currentMessage.text)
              break
            default:
              break
          }
        },
      )
    }
  }

  styledBubbleToNext() {
    const { currentMessage, nextMessage, position, containerToNextStyle } =
      this.props

    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    ) {
      return [
        styles[position].containerToNext,
        containerToNextStyle && containerToNextStyle[position],
      ]
    }

    return null
  }

  styledBubbleToPrevious() {
    const {
      currentMessage,
      previousMessage,
      position,
      containerToPreviousStyle,
    } = this.props

    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ]
    }

    return null
  }

  renderQuickReplies() {
    const {
      currentMessage,
      onQuickReply,
      nextMessage,
      renderQuickReplySend,
      quickReplyStyle,
      quickReplyTextStyle,
    } = this.props

    if (currentMessage && currentMessage.quickReplies) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        renderQuickReplies,
        ...quickReplyProps
      } = this.props

      if (typeof renderQuickReplies === 'function') {
        return renderQuickReplies({ currentMessage, ...quickReplyProps })
      }

      return (
        <QuickReplies
          {...{
            currentMessage,
            onQuickReply,
            nextMessage,
            renderQuickReplySend,
            quickReplyStyle,
            quickReplyTextStyle,
          }}
        />
      )
    }

    return null
  }

  renderMessageText() {
    const { currentMessage } = this.props

    if (currentMessage?.text) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        optionTitles,
        renderMessageText,
        ...messageTextProps
      } = this.props

      if (typeof renderMessageText === 'function') {
        return renderMessageText(messageTextProps)
      }

      return <MessageText {...messageTextProps} />
    }

    return null
  }

  renderMessageImage() {
    const { currentMessage } = this.props

    if (currentMessage?.image) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        renderMessageImage,
        ...messageImageProps
      } = this.props

      if (typeof renderMessageImage === 'function') {
        return renderMessageImage(messageImageProps)
      }

      return <MessageImage {...messageImageProps} />
    }

    return null
  }

  renderMessageVideo() {
    const { currentMessage } = this.props

    if (currentMessage?.video) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        renderMessageVideo,
        ...messageVideoProps
      } = this.props

      if (typeof renderMessageVideo === 'function') {
        return renderMessageVideo(messageVideoProps)
      }

      return <MessageVideo {...messageVideoProps} />
    }

    return null
  }

  renderMessageAudio() {
    const { currentMessage } = this.props

    if (currentMessage?.audio) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        renderMessageAudio,
        ...messageAudioProps
      } = this.props

      if (typeof renderMessageAudio === 'function') {
        return renderMessageAudio(messageAudioProps)
      }

      return <MessageAudio {...messageAudioProps} />
    }

    return null
  }

  renderTicks() {
    const { currentMessage, renderTicks, user, tickStyle } = this.props

    if (renderTicks && currentMessage) {
      return renderTicks(currentMessage)
    }

    if (
      currentMessage &&
      user &&
      currentMessage.user &&
      currentMessage.user._id !== user._id
    ) {
      return null
    }

    if (
      currentMessage &&
      (currentMessage.sent || currentMessage.received || currentMessage.pending)
    ) {
      return (
        <View style={styles.content.tickView}>
          {!!currentMessage.sent && (
            <Text style={[styles.content.tick, tickStyle]}>
              {BUBBLE_DEFAULT_SENT_TICK}
            </Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.content.tick, tickStyle]}>
              {BUBBLE_DEFAULT_RECEIVED_TICK}
            </Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.content.tick, tickStyle]}>
              {BUBBLE_DEFAULT_PENDING_TICK}
            </Text>
          )}
        </View>
      )
    }

    return null
  }

  renderTime() {
    const { currentMessage } = this.props

    if (currentMessage?.createdAt) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        textStyle,
        renderTime,
        ...timeProps
      } = this.props

      if (typeof renderTime === 'function') {
        return renderTime({ currentMessage, ...timeProps })
      }

      return <Time currentMessage={currentMessage} {...timeProps} />
    }

    return null
  }

  renderUsername() {
    const { currentMessage, user, renderUsernameOnMessage, usernameStyle } =
      this.props

    if (renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id) {
        return null
      }

      const combinedUsernameStyle = [
        styles.content.username,
        usernameStyle,
      ] as TextStyle

      return (
        <View style={styles.content.usernameView}>
          <Text style={combinedUsernameStyle}>
            {`${BUBBLE_RENDER_USERNAME_TICK} ${currentMessage.user.name}`}
          </Text>
        </View>
      )
    }

    return null
  }

  renderCustomView() {
    const { renderCustomView } = this.props

    if (typeof renderCustomView === 'function') {
      return renderCustomView(this.props)
    }

    return null
  }

  renderBubbleContent() {
    const { isCustomViewBottom } = this.props

    return isCustomViewBottom ? (
      <View>
        <>
          {this.renderMessageImage()}
          {this.renderMessageVideo()}
          {this.renderMessageAudio()}
          {this.renderMessageText()}
          {this.renderCustomView()}
        </>
      </View>
    ) : (
      <View>
        <>
          {this.renderCustomView()}
          {this.renderMessageImage()}
          {this.renderMessageVideo()}
          {this.renderMessageAudio()}
          {this.renderMessageText()}
        </>
      </View>
    )
  }

  render() {
    const {
      bottomContainerStyle,
      containerStyle,
      position,
      touchableProps,
      wrapperStyle,
    } = this.props

    return (
      <View
        style={[
          styles[position].container,
          containerStyle && containerStyle[position],
        ]}
      >
        <>
          <View
            style={[
              styles[position].wrapper,
              this.styledBubbleToNext(),
              this.styledBubbleToPrevious(),
              wrapperStyle && wrapperStyle[position],
            ]}
          >
            <TouchableWithoutFeedback
              onPress={this.onPress}
              onLongPress={this.onLongPress}
              {...touchableProps}
            >
              <View>
                {this.renderBubbleContent()}
                <View
                  style={[
                    styles[position].bottom,
                    bottomContainerStyle && bottomContainerStyle[position],
                  ]}
                >
                  <>
                    {this.renderUsername()}
                    {this.renderTime()}
                    {this.renderTicks()}
                  </>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.renderQuickReplies()}
        </>
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.leftBubbleBackground,
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.defaultBlue,
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  }),
  content: StyleSheet.create({
    tick: {
      fontSize: 10,
      backgroundColor: Color.backgroundTransparent,
      color: Color.white,
    },
    tickView: {
      flexDirection: 'row',
      marginRight: 10,
    },
    username: {
      top: -3,
      left: 0,
      fontSize: 12,
      backgroundColor: 'transparent',
      color: '#aaa',
    },
    usernameView: {
      flexDirection: 'row',
      marginHorizontal: 10,
    },
  }),
}

export default Bubble
