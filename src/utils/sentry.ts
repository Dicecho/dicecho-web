import type { CaptureContext } from '@sentry/types';
import * as Sentry from '@sentry/react';
import _get from 'lodash/get';
import _once from 'lodash/once';
import _isNil from 'lodash/isNil';
import config from './config';

const environment = config.environment;
interface ReportUser {
  _id: string;
  nickName: string;
  avatarUrl: string;
  email?: string;
}

/**
 * 初始化Sentry
 * 并确保只能初始化一次
 */
const initSentry = _once(() => {
  if (!config.sentry.enable) {
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment,
    integrations: [new Sentry.Integrations.Breadcrumbs({ console: false }) as any],
    tracesSampleRate: 0.2,
    denyUrls: ['chrome-extension://'],
    ignoreErrors: [
      'Non-Error promise rejection captured with keys: config, request, response',
      'Network Error',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered',
      `Can't find variable: Notification`,
      `'Notification' is undefined`,
      'ReferenceError: Notification is not defined',
      `Cannot read property 'className' of null`,
      `Unable to get property 'className' of undefined or null reference`,
      'window.bannerNight is not a function',
      'Request failed with status code 429',
    ],
  });
});

/**
 * 汇报错误
 * @param err 错误
 */
export async function error(err: Error | string) {
  if (!config.sentry.enable) {
    return;
  }

  initSentry(); // 确保Sentry被初始化
  let fn;
  if (typeof err === 'string') {
    fn = Sentry.captureMessage.bind(Sentry);
  } else {
    fn = Sentry.captureException.bind(Sentry);
  }
  const context: CaptureContext = {
  };
  const sentryId = fn(err, context);
  console.warn('error: sentryId', sentryId);
}

/**
 * 设置用户信息操作
 */
export function setUser(user: ReportUser) {
  if (!config.sentry.enable) {
    return;
  }

  initSentry(); // 确保Sentry被初始化

  Sentry.setUser({
    id: user._id,
    username: user.nickName,
    email: user.email,
  });
}

/**
 * 打开报告面板
 */
export function showReportDialog() {
  if (!config.sentry.enable) {
    return;
  }

  Sentry.showReportDialog();
}

/**
 * 获取api路径
 */
// export function getFeedbackUrl(): string | null {
//   const feedbackUrl = _get(Config, 'sentry.feedbackUrl');
//   if (_isNil(feedbackUrl) || feedbackUrl === '') {
//     return null;
//   }

//   return feedbackUrl;
// }

export function getLastEventId(): string | undefined {
  if (!config.sentry.enable) {
    return;
  }

  return Sentry.lastEventId();
}

/**
 * 使用sentry包裹组件
 */
export function wrapSentry(Component: React.ComponentType) {
  initSentry(); // 确保Sentry被初始化

  return Sentry.withProfiler(Component);
}
