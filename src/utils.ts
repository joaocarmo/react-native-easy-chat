import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import type { IMessage } from './Models'

type ConsoleLogArgs = Parameters<typeof console.log>

const HEADER_LOG = '%c[react-native-easy-chat]'
const IS_DEV = process.env.NODE_ENV === 'development'

export const styleString = (color: string) =>
  `color: ${color}; font-weight: bold`

export const print = (...args: ConsoleLogArgs) =>
  // eslint-disable-next-line no-console
  console.log(HEADER_LOG, ...args)

export const debug = (...args: ConsoleLogArgs) => {
  if (IS_DEV) {
    print(styleString('yellow'), ...args)
  }
}

export const error = (...args: ConsoleLogArgs) =>
  print(styleString('red'), ...args)

export const warning = (...args: ConsoleLogArgs) =>
  print(styleString('orange'), ...args)

export const StylePropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.number,
  PropTypes.bool,
])

export const isSameDay = (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined,
) => {
  if (!diffMessage || !diffMessage.createdAt) {
    return false
  }

  const currentCreatedAt = dayjs(currentMessage.createdAt)
  const diffCreatedAt = dayjs(diffMessage.createdAt)

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day')
}

export const isSameUser = (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined,
) =>
  !!(
    diffMessage &&
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  )
