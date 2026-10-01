module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null,
    'no-empty-source': null,
    'scss/at-import-partial-extension': null,
    'custom-property-pattern': null
  },
  ignoreFiles: ['dist/**', 'node_modules/**']
}
