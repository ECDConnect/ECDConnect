import { MetricsColorEnum } from '@ecdlink/core';
import { AlertType } from '@ecdlink/ui';

export const getAlertType = (color: string): AlertType => {
  switch (color) {
    case MetricsColorEnum.Error:
      return 'error';
    case MetricsColorEnum.Warning:
      return 'warning';
    case MetricsColorEnum.Success:
      return 'success';
    default:
      return 'info';
  }
};
