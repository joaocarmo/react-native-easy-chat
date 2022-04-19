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
