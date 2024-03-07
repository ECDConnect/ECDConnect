import { MetricsColorEnum } from '@ecdlink/core';
import { AlertSeverityType } from '@ecdlink/ui';

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
