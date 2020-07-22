module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'airbnb',
  ],
  plugins: [
    'vue',
  ],
  // add your custom rules here
  rules: {},
};
