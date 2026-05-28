module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@services':   './src/services',
            '@viewmodels': './src/viewmodels',
            '@views':      './src/views',
            '@components': './src/views/components',
            '@screens':    './src/views/screens',
            '@models':     './src/models',
            '@store':      './src/store',
            '@theme':      './src/theme',
            '@navigation': './src/navigation',
            '@constants':  './src/constants',
            '@hooks':      './src/hooks',
            '@utils':      './src/utils',
            '@assets': './src/assets',
          },
        },
      ],
    ],
  };
};
