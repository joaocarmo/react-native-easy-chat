import { Platform } from 'react-native'

export const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
  web: 34,
})
export const MAX_COMPOSER_HEIGHT = 200
export const DEFAULT_PLACEHOLDER = 'Type a message...'
export const DATE_FORMAT = 'll'
export const TIME_FORMAT = 'LT'

export const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel']

export const AUDIO_NOT_IMPLEMENTED_MESSAGE =
  'Audio is not implemented by EasyChat.'
export const AUDIO_NOT_IMPLEMENTED_TITLE =
  'You need to provide your own implementation by using renderMessageAudio prop.'

export const VIDEO_NOT_IMPLEMENTED_TITLE =
  'Video is not implemented by EasyChat.'
export const VIDEO_NOT_IMPLEMENTED_MESSAGE =
  'You need to provide your own implementation by using renderMessageVideo prop.'
