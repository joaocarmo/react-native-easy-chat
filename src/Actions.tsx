import type { ReactNode } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { StyleProp, ViewStyle, TextStyle } from 'react-native'
import { useCallbackOne } from 'use-memo-one'
import Color from './Color'
import { useChatContext } from './EasyChatContext'
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

const Actions = ({
  options = {},
  optionTintColor = Color.optionTintColor,
  icon,
  wrapperStyle,
  iconTextStyle,
  onPressActionButton,
  containerStyle,
}: ActionsProps) => {
  const { actionSheet } = useChatContext()
  const onActionsPress = useCallbackOne(() => {
    const optionKeys = Object.keys(options)
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
          options[key]()
        }
      },
    )
  }, [])

  const renderIcon = useCallbackOne(() => {
    if (icon) {
      return icon()
    }

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>
          {ACTIONS_DEFAULT_ICON_TEXT}
        </Text>
      </View>
    )
  }, [])

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPressActionButton || onActionsPress}
    >
      <>{renderIcon()}</>
    </TouchableOpacity>
  )
}

Actions.defaultProps = {
  options: {},
  optionTintColor: Color.optionTintColor,
  icon: undefined,
  onPressActionButton: undefined,
  containerStyle: {},
  iconTextStyle: {},
  wrapperStyle: {},
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
