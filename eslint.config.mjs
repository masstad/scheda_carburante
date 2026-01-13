import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  // Ignora cartelle/file che non vuoi lintare
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**']
  },

  // Regole per JS
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script', // per JS “classico” da browser (non module)
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      // "Soft" ma utili (bug reali)
      'no-undef': 'error',
      'no-unused-vars': [
		  'warn',
		  {
			argsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_'
		  }
		],
      'no-redeclare': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'eqeqeq': ['warn', 'always'],
      'no-debugger': 'warn'
    }
  },

  // Disattiva tutte le regole di stile che confliggono con Prettier
  prettier
];
