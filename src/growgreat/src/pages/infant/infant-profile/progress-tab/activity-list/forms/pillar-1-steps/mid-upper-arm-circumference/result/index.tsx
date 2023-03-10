import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  Alert,
  AlertSeverityType,
  FormInput,
  getColourByAlertSeverity,
  getShapeClassByAlertSeverity,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';

const mocked_data: {
  date: string;
  muac: string;
  type: AlertSeverityType;
  actionTaken: string;
}[] = [
  {
    date: '5 Apr 2022',
    muac: '10.8 cm',
    type: 'error',
    actionTaken: 'Referred',
  },
  {
    date: '1 Apr 2022',
    muac: '12.2 cm',
    type: 'warning',
    actionTaken: 'Referred',
  },
  {
    date: '10 May 2021',
    muac: '12.5 cm',
    type: 'success',
    actionTaken: 'None',
  },
  {
    date: '12 Jun 2021',
    muac: '13 cm',
    type: 'success',
    actionTaken: 'None',
  },
  {
    date: '1 Aug 2021',
    muac: '14.8 cm',
    type: 'success',
    actionTaken: 'None',
  },
  {
    date: '1 Jan 2021',
    muac: '15 cm',
    type: 'success',
    actionTaken: 'None',
  },
];

export const MidUpperArmCircumferenceResultStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  // TODO: add integration
  const showResult = true;

  // TODO: add integration
  const renderCard = useMemo(() => {
    if (mocked_data.some((item) => item.type === 'error')) {
      return (
        <Alert
          type="error"
          title={`Refer ${name} to the clinic urgently. ${name} has severe acute malnutrition.`}
          titleColor="errorDark"
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationCircleIcon', 'text-errorMain w-10 h-10')}
            </div>
          }
        />
      );
    }

    if (mocked_data.some((item) => item.type === 'warning')) {
      return (
        <Alert
          type="warning"
          title={`Refer ${name} to the clinic. ${name} has moderate acute malnutrition.`}
          titleColor="alertDark"
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationIcon', 'text-alertMain w-10 h-10')}
            </div>
          }
        />
      );
    }
    return (
      <SuccessCard
        text={`${name} is growing well! Great job ${caregiverName}.`}
        color="successMain"
        customIcon={<CelebrateIcon className="h-14	w-14" />}
      />
    );
  }, [caregiverName, name]);

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
        subTitle="Mid-upper arm circumference"
      />
      <div className="relative flex flex-col gap-3 p-4">
        {showResult ? (
          <>
            <Alert
              type="warning"
              title={`Discuss ${name}'s growth with ${caregiverName}`}
              titleColor="textDark"
              customIcon={
                <div className="bg-tertiary h-14 w-14 rounded-full">
                  <Polly className="h-14 w-14" />
                </div>
              }
            />
            {renderCard}
            <table className="mb-6 border border-gray-100">
              <thead>
                <tr className="bg-uiBg border-primary border-b text-left">
                  <th className={'py-4 px-6'}>DATE</th>
                  <th>MUAC</th>
                  <th>ACTION TAKEN</th>
                </tr>
              </thead>
              <tbody>
                {mocked_data.map((item, index) => (
                  <tr
                    key={`${item.date}->${item.muac}`}
                    className={index % 2 === 0 ? '' : 'bg-uiBg'}
                  >
                    <td className="py-4 pl-6">{item.date}</td>
                    <td className="flex items-center gap-1 py-4">
                      <div
                        className={getShapeClassByAlertSeverity(item.type)}
                      ></div>
                      <Typography
                        className="truncate pl-1"
                        type="small"
                        weight="skinny"
                        color={getColourByAlertSeverity(item.type)}
                        text={item.muac}
                      ></Typography>
                    </td>
                    <td>{item.actionTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <FormInput
                label={'Weight'}
                placeholder={'Tap to add'}
                type={'number'}
              ></FormInput>
              <Typography
                type="body"
                color="textDark"
                text={'kg'}
                className="mt-7"
              />
            </div>
            <div className="flex items-center gap-1">
              <FormInput
                label={'Length'}
                placeholder={'Tap to add'}
                type={'number'}
              ></FormInput>
              <Typography
                type="body"
                color="textDark"
                text="cm"
                className="mt-7"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
