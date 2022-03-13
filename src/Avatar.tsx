import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'
import {
  StyleSheet,
  View,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native'
import EasyAvatar from './EasyAvatar'
import { StylePropType, isSameUser, isSameDay } from './utils'
import { Omit, IMessage, User, LeftRightStyle } from './Models'

export interface AvatarProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position: 'left' | 'right'
  renderAvatarOnTop?: boolean
  showAvatarForEveryMessage?: boolean
  imageStyle?: LeftRightStyle<ImageStyle>
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: TextStyle
  renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode
  onPressAvatar?(user: User): void
  onLongPressAvatar?(user: User): void
}

class Avatar<TMessage extends IMessage = IMessage> extends React.Component<
  AvatarProps<TMessage>
> {
  static defaultProps = {
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    position: 'left',
    currentMessage: {
      user: null,
    },
    previousMessage: {},
    nextMessage: {},
    textStyle: undefined,
    renderAvatar: undefined,
    containerStyle: {},
    imageStyle: {},
    onPressAvatar: () => null,
    onLongPressAvatar: () => null,
  }

  static propTypes = {
    renderAvatarOnTop: PropTypes.bool,
    showAvatarForEveryMessage: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    onPressAvatar: PropTypes.func,
    onLongPressAvatar: PropTypes.func,
    renderAvatar: PropTypes.func,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    imageStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
  }

  renderAvatar() {
    const { renderAvatar, ...avatarProps } = this.props

    if (typeof renderAvatar === 'function') {
      return renderAvatar(avatarProps)
    }

    const {
      currentMessage,
      imageStyle,
      onLongPressAvatar,
      onPressAvatar,
      position,
      textStyle,
    } = avatarProps
    const avatarStyle = [
      styles[position].image,
      imageStyle?.[position],
    ] as ImageStyle

    if (currentMessage) {
      return (
        <EasyAvatar
          avatarStyle={avatarStyle}
          textStyle={textStyle || {}}
          user={currentMessage.user}
          onPress={() =>
            typeof onPressAvatar === 'function' &&
            onPressAvatar(currentMessage.user)
          }
          onLongPress={() =>
            typeof onLongPressAvatar === 'function' &&
            onLongPressAvatar(currentMessage.user)
          }
        />
      )
    }
    return null
  }

  render() {
    const {
      renderAvatarOnTop,
      showAvatarForEveryMessage,
      containerStyle,
      position,
      currentMessage,
      renderAvatar,
      previousMessage,
      nextMessage,
      imageStyle,
    } = this.props
    const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage
    const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom'

    if (renderAvatar === null) {
      return null
    }

    if (
      !showAvatarForEveryMessage &&
      currentMessage &&
      messageToCompare &&
      isSameUser(currentMessage, messageToCompare) &&
      isSameDay(currentMessage, messageToCompare)
    ) {
      return (
        <View
          style={[
            styles[position].container,
            containerStyle && containerStyle[position],
          ]}
        >
          <EasyAvatar
            avatarStyle={
              [
                styles[position].image,
                imageStyle && imageStyle[position],
              ] as ImageStyle
            }
          />
        </View>
      )
    }

    return (
      <View
        style={[
          styles[position].container,
          styles[position][computedStyle],
          containerStyle && containerStyle[position],
        ]}
      >
        {this.renderAvatar()}
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
}

export default Avatar
