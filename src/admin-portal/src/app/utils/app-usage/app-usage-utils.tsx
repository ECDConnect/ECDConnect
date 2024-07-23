import React from 'react';

import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { ConnectUsageName } from './app-usage.types';

const ColumnStatusIndicator = ({ icon, iconColor, text }) => (
  <div className="flex items-center gap-0.5">
    <div>
      {React.createElement(icon, { className: `${iconColor} h-5 w-5` })}
    </div>
    <span className={iconColor}>{text}</span>
  </div>
);

export const columnColor = (value?: string, valueColor?: string) => {
  const iconMapping = {
    [ConnectUsageName?.InvitationActive]: {
      icon: ClockIcon,
      color: 'text-' + valueColor,
    },
    [ConnectUsageName?.InvitationExpired]: {
      icon: XCircleIcon,
      color: 'text-' + valueColor,
    },
    [ConnectUsageName?.SmsFailedAuthentication]: {
      icon: XCircleIcon,
      color: 'text-' + valueColor,
    },
    [ConnectUsageName?.SmsFailedConnection]: {
      icon: XCircleIcon,
      color: 'text-' + valueColor,
    },
    [ConnectUsageName?.SmsFailedInsufficientCredits]: {
      icon: XCircleIcon,
      color: 'text-' + valueColor,
    },
    [ConnectUsageName?.SmsFailedOptedOut]: {
      icon: XCircleIcon,
      color: 'text-' + valueColor,
    },
    'Removed:': { icon: XCircleIcon, color: 'text-' + valueColor },
    default: { icon: CheckCircleIcon, color: 'text-' + valueColor },
  };

  const firstWord = value?.split(' ')[0];
  const key = Object.hasOwn(iconMapping, value)
    ? value
    : firstWord === 'Removed:'
    ? 'Removed:'
    : 'default';
  const { icon, color } = iconMapping[key];

  return <ColumnStatusIndicator icon={icon} iconColor={color} text={value} />;
};
