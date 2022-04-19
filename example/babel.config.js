module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-easy-chat': '../src',
          },
        },
      ],
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
    ],
  }
}
