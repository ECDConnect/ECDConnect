import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  Alert,
  AlertSeverityType,
  getColourByAlertSeverity,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

export const InterventionsStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const renderInfoContent = useMemo(() => {
    // TODO: add rules (G5.3.19)
    return [
      `Encourage ${caregiverName} to keep doing what they're doing`,
      'Discuss nutrition messages on page 4-7 in Road to Health book',
      'Continue to growth monitor',
      'Continue to visit and support the family',
    ];
  }, [caregiverName]);

  const renderStatus = useMemo((): {
    type: string;
    icon: string;
    status: string;
    statusType: AlertSeverityType;
  }[] => {
    // TODO: add rules (G5.3.19)
    return [
      {
        type: 'Weight',
        icon: 'CheckCircleIcon',
        statusType: 'success',
        status: 'normal',
      },
      {
        type: 'Length',
        icon: 'CheckCircleIcon',
        statusType: 'success',
        status: 'normal',
      },
      {
        type: 'MUAC',
        icon: 'CheckCircleIcon',
        statusType: 'success',
        status: 'normal',
      },
    ];
  }, []);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
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
