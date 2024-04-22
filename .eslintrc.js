module.exports = {
    'env': {
        'browser': true,
        'node': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'import'
    ],
    'rules': {
        'quotes': [
            'warn',
            'single',
            {
                'allowTemplateLiterals': true
            }
        ],
        'no-unused-vars' : 'warn'
    },
    'settings': {
        'react': {
            'version': 'detect'
        },
    }
}
