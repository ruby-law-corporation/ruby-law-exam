import baseConfig from '@app/eslint-config/base';

export default [...baseConfig, { ignores: ['src/generated/**'] }];
