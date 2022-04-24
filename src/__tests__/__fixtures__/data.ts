import type { IMessage, User } from '../../Models'

export const DEFAULT_TEST_USER: User = { _id: 'test' }

export const DEFAULT_TEST_MESSAGE: IMessage = {
  _id: 'test',
  text: 'test',
  user: { _id: 'test' },
  createdAt: new Date(2022, 3, 17),
}

export const DEFAULT_TEST_MESSAGE2: IMessage = {
  _id: 1,
  text: 'Hello developer',
  createdAt: new Date(2022, 3, 17),
  user: {
    _id: 2,
    name: 'React Native',
  },
}
