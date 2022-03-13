module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
    ],
  }
}
