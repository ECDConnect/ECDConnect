import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  Alert,
  AlertSeverityType,
  getColourByAlertSeverity,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { capitalizeFirstLetter } from '@ecdlink/core';

export const InterventionsStep = ({
  infant,
  growthMonitoring,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );

  const items = useMemo(
    () => growthMonitoring && Object.keys(growthMonitoring),
    [growthMonitoring]
  );

  const getStatusIcon = useCallback((statusType: AlertSeverityType) => {
    switch (statusType) {
      case 'error':
        return 'ExclamationIcon';
      case 'warning':
        return 'ExclamationCircleIcon';
      default:
        return 'CheckCircleIcon';
    }
  }, []);

  const renderInfoContent = useMemo(() => {
    const error = items?.some(
      (item) => growthMonitoring?.[item].statusType === 'error'
    );
    const warning = items?.some(
      (item) => growthMonitoring?.[item].statusType === 'warning'
    );

    if (error) {
      return [
        'Urgently refer to the nearest clinic.',
        'Follow up with the family in a few days.',
      ];
    }

    if (warning) {
      return [
        'Refer to clinic for nutrition support',
        'Refer to social services for food insecurity support',
        `Make sure ${name} is getting child support grant (if eligible)`,
        'Check Vitamin A. deworming and immunizations up to date',
        'Discuss nutrition messages on page 4-7 in Road to Health book',
        'Continue to visit and support the family',
      ];
    }

    return [
      `Encourage ${caregiverName} to keep doing what they're doing`,
      'Discuss nutrition messages on page 4-7 in Road to Health book',
      'Continue to growth monitor',
      'Continue to visit and support the family',
    ];
  }, [caregiverName, growthMonitoring, items, name]);

  const renderStatus = useMemo((): {
    type: string;
    icon: string;
    status: string;
    statusType: AlertSeverityType;
  }[] => {
    return items?.length
      ? items.map((item) => ({
          type:
            item === 'muac' ? item.toUpperCase() : capitalizeFirstLetter(item),
          icon: getStatusIcon(growthMonitoring?.[item].statusType),
          statusType: growthMonitoring?.[item].statusType,
          status: growthMonitoring?.[item].value,
        }))
      : [];
  }, [getStatusIcon, growthMonitoring, items]);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Growth monitoring"
        subTitle="Interventions"
      />
      <div className="relative flex flex-col gap-3 p-4">
        {renderStatus.map((item) => (
          <div className="flex items-center" key={item.type}>
            {renderIcon(
              item.icon,
              `w-8 h-8 mr-2 text-${getColourByAlertSeverity(item.statusType)}`
            )}
            <Typography type="h4" text={item.type} />
            <span className="mx-1">-</span>
            <Typography
              type="h4"
              color={getColourByAlertSeverity(item.statusType)}
              text={item.status}
            />
          </div>
        ))}
        <Alert type="info" title="What next?" list={renderInfoContent} />
      </div>
    </>
  );
};
