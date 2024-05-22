import { MetricsColorEnum } from '@ecdlink/core';
import { AlertSeverityType } from '@ecdlink/ui';

export const limitStringLength = (string = '', limit = 0) => {
  if (string.trim().length > 50) {
    return string.substring(0, limit) + '...';
  } else {
    return string.substring(0, limit);
  }
};

// TODO: put it in Ui package
export const getAlertSeverity = (color: string): AlertSeverityType => {
  switch (color) {
    case MetricsColorEnum.Error:
      return 'error';
    case MetricsColorEnum.Warning:
      return 'warning';
    case MetricsColorEnum.Success:
      return 'success';
    default:
      return 'none';
  }
};

export const isEmail = (val: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
};
