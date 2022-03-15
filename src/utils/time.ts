import moment from 'moment';

type formatConfig = {
  unit?: 'second' | 'millisecond';
  format?: string;
  simple?: boolean;
};

export const formatDate = (timestamp: number, config?: formatConfig) => {
  let _timestamp = timestamp;
  let _config: formatConfig = {
    unit: 'millisecond',
    format: 'YYYY-MM-DD HH:mm',
    ...config,
  };
  if (_config.unit === 'second') {
    _timestamp *= 1000;
  }

  let localTime = moment(_timestamp);
  if (localTime.isAfter(moment().subtract(1, 'm'))) {
    // 时间小于一分钟内
    return '刚刚';
  }
  if (localTime.isAfter(moment().subtract(1, 'day'))) {
    // 时间在24h内
    let date = moment().diff(localTime) / 1000;
    if (Math.floor(date / 3600) === 0) {
      return `${Math.floor(date / 60)} 分钟前`;
    }

    return `${Math.floor(date / 3600)} 小时前`;
  }

  if (config?.simple) {
    const date = moment().diff(localTime) / 1000;
    if (localTime.isAfter(moment().subtract(1, 'month'))) {
      // 时间在1个月内
      return `${Math.floor(date / 3600 / 24)} 天前`;
    }

    if (localTime.isAfter(moment().subtract(1, 'year'))) {
      // 时间在1年内
      return `${Math.floor(date / 3600 / 24 / 30)} 月前`;
    }

    return `${Math.floor(date / 3600 / 24 / 365)} 年前`;
  }

  return localTime.format(_config.format);
};
