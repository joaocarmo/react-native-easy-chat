import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import type { IMessage } from '../Models'

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
