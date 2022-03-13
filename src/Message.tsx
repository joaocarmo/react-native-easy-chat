import { Component } from 'react'
import type { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native'

import Avatar from './Avatar'
import Bubble from './Bubble'
import SystemMessage from './SystemMessage'
import Day from './Day'

import { StylePropType, isSameUser } from './utils'
import { IMessage, User, LeftRightStyle } from './Models'

export interface MessageProps<TMessage extends IMessage> {
  key: any
  showUserAvatar?: boolean
  position: 'left' | 'right'
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  user: User
  inverted?: boolean
  containerStyle?: LeftRightStyle<ViewStyle>
  renderBubble?(props: Bubble['props']): ReactNode
  renderDay?(props: Day['props']): ReactNode
  renderSystemMessage?(props: SystemMessage['props']): ReactNode
  renderAvatar?(props: Avatar['props']): ReactNode
  shouldUpdateMessage?(
    props: MessageProps<IMessage>,
    nextProps: MessageProps<IMessage>,
  ): boolean
  onMessageLayout?(event: LayoutChangeEvent): void
}

class Message<TMessage extends IMessage = IMessage> extends Component<
  MessageProps<TMessage>
> {
  static defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    renderSystemMessage: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
    showUserAvatar: false,
    inverted: true,
    shouldUpdateMessage: undefined,
    onMessageLayout: undefined,
  }

  static propTypes = {
    renderAvatar: PropTypes.func,
    showUserAvatar: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    shouldUpdateMessage: PropTypes.func,
    onMessageLayout: PropTypes.func,
  }

  shouldComponentUpdate(nextProps: MessageProps<TMessage>) {
    const { currentMessage: current, shouldUpdateMessage } = this.props
    const { currentMessage: next } = nextProps

    const { previousMessage, nextMessage } = this.props
    const nextPropsMessage = nextProps.nextMessage
    const nextPropsPreviousMessage = nextProps.previousMessage

    const shouldUpdate = shouldUpdateMessage?.(this.props, nextProps) || false

    return (
      next?.sent !== current?.sent ||
      next?.received !== current?.received ||
      next?.pending !== current?.pending ||
      next?.createdAt !== current?.createdAt ||
      next?.text !== current?.text ||
      next?.image !== current?.image ||
      next?.video !== current?.video ||
      next?.audio !== current?.audio ||
      previousMessage !== nextPropsPreviousMessage ||
      nextMessage !== nextPropsMessage ||
      shouldUpdate
    )
  }

  renderDay() {
    const { currentMessage, renderDay } = this.props

    if (currentMessage?.createdAt) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { containerStyle, onMessageLayout, ...props } = this.props

      if (typeof renderDay === 'function') {
        return renderDay(props)
      }

      return <Day {...props} />
    }

    return null
  }

  renderBubble() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, onMessageLayout, renderBubble, ...props } =
      this.props

    if (typeof renderBubble === 'function') {
      return renderBubble(props)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Bubble {...props} />
  }

  renderSystemMessage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, onMessageLayout, renderSystemMessage, ...props } =
      this.props

    if (typeof renderSystemMessage === 'function') {
      return renderSystemMessage(props)
    }
    return <SystemMessage {...props} />
  }

  renderAvatar() {
    const { user, currentMessage, showUserAvatar } = this.props

    if (
      user &&
      user._id &&
      currentMessage &&
      currentMessage.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
    ) {
      return null
    }

    if (
      currentMessage &&
      currentMessage.user &&
      currentMessage.user.avatar === null
    ) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, onMessageLayout, ...props } = this.props

    return <Avatar {...props} />
  }

  render() {
    const {
      containerStyle,
      currentMessage,
      inverted,
      nextMessage,
      onMessageLayout,
      position,
    } = this.props

    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage)
      const sameUserStyle = { marginBottom: sameUser ? 2 : 10 }
      const invertedStyle = !inverted && { marginBottom: 2 }

      return (
        <View onLayout={onMessageLayout}>
          {this.renderDay()}
          {currentMessage.system ? (
            this.renderSystemMessage()
          ) : (
            <View
              style={[
                styles[position].container,
                sameUserStyle,
                invertedStyle,
                containerStyle && containerStyle[position],
              ]}
            >
              {position === 'left' ? this.renderAvatar() : null}
              {this.renderBubble()}
              {position === 'right' ? this.renderAvatar() : null}
            </View>
          )}
        </View>
      )
    }
    return null
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
}

export default Message
