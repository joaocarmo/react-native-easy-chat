import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import EasyAvatar from './EasyAvatar'
import { isSameUser, isSameDay } from './utils/utils'
import type { Omit, IMessage, User, LeftRightStyle } from './Models'
import { AVATAR_DEFAULT_POSITION } from './Constant'

export interface AvatarProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position?: 'left' | 'right'
  renderAvatarOnTop?: boolean
  showAvatarForEveryMessage?: boolean
  imageStyle?: LeftRightStyle<ImageStyle>
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: TextStyle
  renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode
  onPressAvatar?(user: User): void
  onLongPressAvatar?(user: User): void
}

const Avatar = <TMessage extends IMessage = IMessage>(
  props: AvatarProps<TMessage>,
) => {
  const {
    containerStyle,
    currentMessage,
    imageStyle,
    nextMessage,
    onLongPressAvatar,
    onPressAvatar,
    position: positionProp,
    previousMessage,
    renderAvatar,
    renderAvatarOnTop,
    showAvatarForEveryMessage,
  } = props
  const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage
  const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom'
  const position = positionProp || AVATAR_DEFAULT_POSITION

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

  const renderAvatarComponent = () => {
    if (renderAvatar) {
      const { ...avatarProps } = props
      return typeof renderAvatar === 'function' && renderAvatar(avatarProps)
    }

    if (currentMessage) {
      return (
        <EasyAvatar
          avatarStyle={
            [
              styles[position].image,
              imageStyle && imageStyle[position],
            ] as ImageStyle
          }
          user={currentMessage.user}
          onPress={() => onPressAvatar?.(currentMessage!.user)}
          onLongPress={() => onLongPressAvatar?.(currentMessage!.user)}
        />
      )
    }

    return null
  }

  return (
    <View
      style={[
        styles[position].container,
        styles[position][computedStyle],
        containerStyle && containerStyle[position],
      ]}
    >
      <>{renderAvatarComponent()}</>
    </View>
  )
}

Avatar.defaultProps = {
  renderAvatarOnTop: false,
  showAvatarForEveryMessage: false,
  position: AVATAR_DEFAULT_POSITION,
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
