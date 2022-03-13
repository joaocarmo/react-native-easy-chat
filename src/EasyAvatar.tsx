import { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ImageStyle,
  TextStyle,
} from 'react-native'
import type { GestureResponderEvent } from 'react-native'
import Color from './Color'
import { User } from './Models'
import { StylePropType } from './utils'

const {
  carrot,
  emerald,
  peterRiver,
  wisteria,
  alizarin,
  turquoise,
  midnightBlue,
} = Color

export interface EasyAvatarProps {
  user?: User
  avatarStyle?: StyleProp<ImageStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?(event: GestureResponderEvent): void
  onLongPress?(event: GestureResponderEvent): void
}

class EasyAvatar extends Component<EasyAvatarProps> {
  static defaultProps = {
    user: {
      name: null,
      avatar: null,
    },
    onPress: undefined,
    onLongPress: undefined,
    avatarStyle: {},
    textStyle: {},
  }

  static propTypes = {
    user: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    avatarStyle: StylePropType,
    textStyle: StylePropType,
  }

  avatarName?: string = undefined

  avatarColor?: string = undefined

  setAvatarColor() {
    const { user } = this.props

    const userName = user?.name || ''
    const name = userName.toUpperCase().split(' ')

    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`
    } else {
      this.avatarName = ''
    }

    let sumChars = 0
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i)
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [
      carrot,
      emerald,
      peterRiver,
      wisteria,
      alizarin,
      turquoise,
      midnightBlue,
    ]

    this.avatarColor = colors[sumChars % colors.length]
  }

  renderAvatar() {
    const { avatarStyle, user } = this.props

    if (user) {
      if (typeof user.avatar === 'function') {
        return user.avatar([styles.avatarStyle, avatarStyle])
      }

      if (typeof user.avatar === 'string') {
        return (
          <Image
            source={{ uri: user.avatar }}
            style={[styles.avatarStyle, avatarStyle]}
          />
        )
      }

      if (typeof user.avatar === 'number') {
        return (
          <Image
            source={user.avatar}
            style={[styles.avatarStyle, avatarStyle]}
          />
        )
      }
    }

    return null
  }

  renderInitials() {
    const { textStyle } = this.props

    return <Text style={[styles.textStyle, textStyle]}>{this.avatarName}</Text>
  }

  render() {
    const { avatarStyle, onPress, onLongPress, user } = this.props

    if (!user || (!user.name && !user.avatar)) {
      // render placeholder
      return (
        <View
          style={[styles.avatarStyle, styles.avatarTransparent, avatarStyle]}
          accessibilityTraits="image"
        />
      )
    }

    if (user.avatar) {
      return (
        <TouchableOpacity
          disabled={!onPress}
          onPress={onPress}
          onLongPress={onLongPress}
          accessibilityTraits="image"
        >
          {this.renderAvatar()}
        </TouchableOpacity>
      )
    }

    this.setAvatarColor()

    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[
          styles.avatarStyle,
          { backgroundColor: this.avatarColor },
          avatarStyle,
        ]}
        accessibilityTraits="image"
      >
        {this.renderInitials()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarTransparent: {
    backgroundColor: Color.backgroundTransparent,
  },
  textStyle: {
    color: Color.white,
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '100',
  },
})

export default EasyAvatar
