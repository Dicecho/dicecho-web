import _get from 'lodash/get';
import _isString from 'lodash/isString';

const config = {
  environment: process.env.NODE_ENV || 'development',
  sentry: {
    enable: process.env.REACT_APP_SENTRY_ENABLED === 'true' || false,
    dsn:  process.env.REACT_APP_SENTRY_DSN || '',
  },
  ga: {
    targetId: process.env.REACT_APP_GTARGET_ID || '',
  }
};

export default config;
