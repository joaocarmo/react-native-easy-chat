const path = require('path')
const { getDefaultConfig } = require('@expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.watchFolders = [
  ...defaultConfig.watchFolders,
  path.resolve(__dirname, '../src'),
]

defaultConfig.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (target.hasOwnProperty(name)) {
        return target[name]
      }

      if (name === 'react-native-easy-chat') {
        return path.join(process.cwd(), '../src')
      }

      return path.join(process.cwd(), `node_modules/${name}`)
    },
  },
)

module.exports = defaultConfig
