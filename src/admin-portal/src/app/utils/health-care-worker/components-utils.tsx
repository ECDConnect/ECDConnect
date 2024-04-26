import React from 'react';

import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/solid';

import { ConnectUsageName } from '../../constants/health-care-worker';

const ColumnStatusIndicator = ({ icon, iconColor, text }) => (
  <div className="flex items-center gap-0.5">
    <div>
      {React.createElement(icon, { className: `${iconColor} h-5 w-5` })}
    </div>
    <span className={iconColor}>{text}</span>
  </div>
);

export const columnColor = (value?: string) => {
  const iconMapping = {
    [ConnectUsageName?.InvitationActive]: {
      icon: ClockIcon,
      color: 'text-infoMain',
    },
    [ConnectUsageName?.InvitationExpired]: {
      icon: XCircleIcon,
      color: 'text-errorMain',
    },
    'Removed:': { icon: XCircleIcon, color: 'text-alertMain' },
    default: { icon: CheckCircleIcon, color: 'text-successMain' },
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
