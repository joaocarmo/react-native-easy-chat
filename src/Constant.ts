import { Platform } from 'react-native'

export const MIN_COMPOSER_HEIGHT =
  Platform.select({
    ios: 33,
    android: 41,
    web: 34,
  }) ?? 30
export const MAX_COMPOSER_HEIGHT = 200
export const DEFAULT_PLACEHOLDER = 'Type a message...'
export const DATE_FORMAT = 'll'
export const TIME_FORMAT = 'LT'

export const BUBBLE_DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel']

export const BUBBLE_DEFAULT_SENT_TICK = '✓'
export const BUBBLE_DEFAULT_RECEIVED_TICK = '✓'
export const BUBBLE_DEFAULT_PENDING_TICK = '🕓'

export const BUBBLE_RENDER_USERNAME_TICK = '~'

export const DEFAULT_INPUT_TOOLBAR_HEIGHT = 44

export const MESSAGE_DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel']

export const ACTIONS_DEFAULT_ICON_TEXT = '+'

export const AUDIO_NOT_IMPLEMENTED_MESSAGE =
  'Audio is not implemented by EasyChat.'
export const AUDIO_NOT_IMPLEMENTED_TITLE =
  'You need to provide your own implementation by using renderMessageAudio prop.'

export const VIDEO_NOT_IMPLEMENTED_TITLE =
  'Video is not implemented by EasyChat.'
export const VIDEO_NOT_IMPLEMENTED_MESSAGE =
  'You need to provide your own implementation by using renderMessageVideo prop.'
