import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Color from './Color'
import { StylePropType } from './utils'
import { ACTIONS_DEFAULT_ICON_TEXT } from './Constant'

export interface ActionsProps {
  options?: Record<string, any>
  optionTintColor?: string
  icon?: () => ReactNode
  wrapperStyle?: StyleProp<ViewStyle>
  iconTextStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPressActionButton?(): void
}

class Actions extends React.Component<ActionsProps> {
  static defaultProps: ActionsProps = {
    options: {},
    optionTintColor: Color.optionTintColor,
    icon: undefined,
    onPressActionButton: undefined,
    containerStyle: {},
    iconTextStyle: {},
    wrapperStyle: {},
  }

  static propTypes = {
    options: PropTypes.object,
    optionTintColor: PropTypes.string,
    icon: PropTypes.func,
    onPressActionButton: PropTypes.func,
    wrapperStyle: StylePropType,
    containerStyle: StylePropType,
  }

  static contextTypes = {
    actionSheet: PropTypes.func,
  }

  onActionsPress = () => {
    const { actionSheet } = this.context
    const { options, optionTintColor } = this.props

    const optionKeys = Object.keys(options ?? {})
    const cancelButtonIndex = optionKeys.indexOf('Cancel')
    actionSheet().showActionSheetWithOptions(
      {
        options: optionKeys,
        cancelButtonIndex,
        tintColor: optionTintColor,
      },
      (buttonIndex: number) => {
        const key = optionKeys[buttonIndex]
        if (key) {
          options?.[key](this.props)
        }
      },
    )
  }

  renderIcon() {
    const { icon, iconTextStyle, wrapperStyle } = this.props

    if (typeof icon === 'function') {
      return icon()
    }

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>
          {ACTIONS_DEFAULT_ICON_TEXT}
        </Text>
      </View>
    )
  }

  render() {
    const { containerStyle, onPressActionButton } = this.props

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={onPressActionButton || this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: Color.defaultColor,
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center',
  },
})

export default Actions
