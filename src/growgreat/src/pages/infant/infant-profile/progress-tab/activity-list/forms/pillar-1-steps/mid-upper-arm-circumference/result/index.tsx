import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  Alert,
  AlertSeverityType,
  getColourByAlertSeverity,
  getShapeClassByAlertSeverity,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { muacFormSection, muacQuestion } from '../form';
import { useSelector } from 'react-redux';
import { getGrowthDataForInfantSelector } from '@/store/visit/visit.selectors';
import { GrowthMonitoring } from '../..';
import { usePrevious } from '@ecdlink/core';
import { VisitData } from '@ecdlink/graphql';
import { getReferralsForInfantSelector } from '@/store/infant/infant.selectors';

interface MUACData {
  date: string;
  muac: string;
  type: AlertSeverityType;
  actionTaken: string;
}

export const MidUpperArmCircumferenceResultStep = ({
  infant,
  sectionQuestions,
  setEnableButton,
  setGrowthMonitoring,
}: DynamicFormProps) => {
  const referrals = useSelector(getReferralsForInfantSelector);
  const MUACsReferrals = referrals?.filter((item) =>
    item.comment?.toLocaleLowerCase().includes('muac')
  );

  const muac = useMemo(
    () =>
      sectionQuestions?.find(
        (section) => section.visitSection === muacFormSection
      )?.questions?.[0]?.answer,
    [sectionQuestions]
  );

  const getMuacType = (muac: number): AlertSeverityType => {
    if (muac < 11.5) {
      return 'error';
    }

    if (muac < 12.5) {
      return 'warning';
    }

    return 'success';
  };

  const [MUACs, setMUACs] = useState<MUACData[]>([
    {
      actionTaken: 'None',
      date: new Date().toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      muac: String(muac),
      type: getMuacType(Number(muac)),
    },
  ]);

  const growthData = useSelector(getGrowthDataForInfantSelector);

  const uniqueGrowthData = useMemo(
    () =>
      growthData?.filter((object, index, array) => {
        return (
          index ===
          array.findIndex(
            (newObject) =>
              newObject.visit?.plannedVisitDate ===
                object.visit?.plannedVisitDate &&
              newObject.question === object.question
          )
        );
      }),
    [growthData]
  );

  const previousMuacs = uniqueGrowthData?.filter(
    (item) => item.question === muacQuestion
  );
  const previousOfPreviousMuacs = usePrevious(previousMuacs) as
    | VisitData[]
    | undefined;

  const muacMonitoring = useMemo((): GrowthMonitoring['muac'] => {
    if (Number(muac) < 11.5) {
      return { value: 'severe acute malnutrition', statusType: 'error' };
    }

    if (Number(muac) < 12.5) {
      return { value: 'moderate acute malnutrition', statusType: 'warning' };
    }
    return { value: 'normal', statusType: 'success' };
  }, [muac]);

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  useEffect(() => {
    setGrowthMonitoring?.({ muac: muacMonitoring });
  }, [muacMonitoring, setGrowthMonitoring]);

  useEffect(() => {
    if (
      !!previousMuacs?.length &&
      previousMuacs?.length !== previousOfPreviousMuacs?.length
    ) {
      const formattedMuacs = previousMuacs.map((item): MUACData => {
        const muacReferral = MUACsReferrals?.find(
          (muac) => muac.visitData?.id === item.visit?.id
        );

        return {
          actionTaken: Boolean(muacReferral?.isCompleted) ? 'Referred' : 'None',
          date: new Date(item.visit?.plannedVisitDate).toLocaleDateString(
            'en-ZA',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }
          ),
          muac: String(item?.questionAnswer),
          type: getMuacType(Number(item?.questionAnswer)),
        };
      });

      setMUACs((prevState) => [...prevState, ...formattedMuacs]);
    }
  }, [MUACsReferrals, previousMuacs, previousOfPreviousMuacs?.length]);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  const renderCard = useMemo(() => {
    if (MUACs.some((item) => item.type === 'error')) {
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

    if (MUACs.some((item) => item.type === 'warning')) {
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
  }, [MUACs, caregiverName, name]);

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
        <table className="text-textDark mb-6 border border-gray-100">
          <thead>
            <tr className="bg-uiBg border-primary border-b text-left">
              <th className={'py-4 px-6'}>DATE</th>
              <th>MUAC</th>
              <th>ACTION TAKEN</th>
            </tr>
          </thead>
          <tbody>
            {MUACs.map((item, index) => (
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
                    text={`${item.muac} cm`}
                  ></Typography>
                </td>
                <td>{item.actionTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
