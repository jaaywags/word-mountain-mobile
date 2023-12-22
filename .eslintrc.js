module.exports = {
  root: true,
  parser: "babel-eslint",
  overrides: [{
    files: ['*.ts', '*.tsx'], // Your TypeScript files extension

    // As mentioned in the comments, you should extend TypeScript plugins here,
    // instead of extending them outside the `overrides`.
    // If you don't want to extend any rules, you don't need an `extends` attribute.
    extends: [
      // '@react-native-community',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'prettier',
    ],

    parserOptions: {
      project: ['./tsconfig.json'], // Specify it only for TypeScript files
    },

    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/require-await': 'off',
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          "checksVoidReturn": false
        }
      ]
    }
  }],
};