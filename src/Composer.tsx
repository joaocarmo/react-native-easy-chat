import { Component } from 'react'
import PropTypes from 'prop-types'
import { Platform, StyleSheet, TextInput } from 'react-native'
import type { LayoutChangeEvent, TextInputProps } from 'react-native'
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant'
import Color from './Color'
import { StylePropType } from './utils/utils'

export interface ComposerProps {
  composerHeight?: number
  text?: string
  placeholder?: string
  placeholderTextColor?: string
  textInputProps?: Partial<TextInputProps>
  textInputStyle?: TextInputProps['style']
  textInputAutoFocus?: boolean
  keyboardAppearance?: TextInputProps['keyboardAppearance']
  multiline?: boolean
  disableComposer?: boolean
  onTextChanged?(text: string): void
  onInputSizeChanged?(layout: { width: number; height: number }): void
}

class Composer extends Component<ComposerProps> {
  static defaultProps = {
    composerHeight: MIN_COMPOSER_HEIGHT,
    text: '',
    placeholderTextColor: Color.defaultColor,
    placeholder: DEFAULT_PLACEHOLDER,
    textInputProps: null,
    multiline: true,
    disableComposer: false,
    textInputStyle: {},
    textInputAutoFocus: false,
    keyboardAppearance: 'default',
    onTextChanged: () => null,
    onInputSizeChanged: () => null,
  }

  static propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    textInputProps: PropTypes.object,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    multiline: PropTypes.bool,
    disableComposer: PropTypes.bool,
    textInputStyle: StylePropType,
    textInputAutoFocus: PropTypes.bool,
    keyboardAppearance: PropTypes.string,
  }

  layout?: { width: number; height: number } = undefined

  onLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent
    const { onInputSizeChanged } = this.props

    // Support earlier versions of React Native on Android.
    if (!layout) {
      return
    }

    if (
      !this.layout ||
      (this.layout &&
        (this.layout.width !== layout.width ||
          this.layout.height !== layout.height))
    ) {
      this.layout = layout

      onInputSizeChanged?.(this.layout)
    }
  }

  onChangeText = (text: string) => {
    const { onTextChanged } = this.props

    onTextChanged?.(text)
  }

  render() {
    const {
      composerHeight,
      disableComposer,
      keyboardAppearance,
      multiline,
      placeholder,
      placeholderTextColor,
      text,
      textInputAutoFocus,
      textInputProps,
      textInputStyle,
    } = this.props

    return (
      <TextInput
        testID={placeholder}
        accessible
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        editable={!disableComposer}
        onLayout={this.onLayout}
        onChangeText={this.onChangeText}
        style={[
          styles.textInput,
          textInputStyle,
          {
            height: composerHeight,
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: 'transparent',
                outlineOffset: 0,
              },
            }),
          },
        ]}
        autoFocus={textInputAutoFocus}
        value={text}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        keyboardAppearance={keyboardAppearance}
        {...textInputProps}
      />
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    ...Platform.select({
      web: {
        paddingTop: 6,
        paddingLeft: 4,
      },
    }),
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
      web: 4,
    }),
  },
})

export default Composer
