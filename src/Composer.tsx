import { useRef } from 'react'
import type { ReactElement } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import type { LayoutChangeEvent, TextInputProps } from 'react-native'
import { useCallbackOne } from 'use-memo-one'
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant'
import Color from './Color'

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

const Composer = ({
  composerHeight,
  disableComposer,
  keyboardAppearance,
  multiline,
  onInputSizeChanged,
  onTextChanged,
  placeholder,
  placeholderTextColor,
  text,
  textInputAutoFocus,
  textInputProps,
  textInputStyle,
}: ComposerProps): ReactElement => {
  const layoutRef = useRef<{ width: number; height: number }>()

  const handleOnLayout = useCallbackOne(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      // Support earlier versions of React Native on Android.
      if (!layout) {
        return
      }

      if (
        !layoutRef ||
        (layoutRef.current &&
          (layoutRef.current.width !== layout.width ||
            layoutRef.current.height !== layout.height))
      ) {
        layoutRef.current = layout

        if (typeof onInputSizeChanged === 'function') {
          onInputSizeChanged(layout)
        }
      }
    },
    [onInputSizeChanged],
  )

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      editable={!disableComposer}
      onLayout={handleOnLayout}
      onChangeText={onTextChanged}
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

Composer.defaultProps = {
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
