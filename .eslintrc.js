module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    camelcase: 'warn',
    'vue/multi-word-component-names': ['error', { ignores: ['Burger', 'Carousel', 'Document', 'Histogram', 'Home', 'Pagination'] }]
  }
}
