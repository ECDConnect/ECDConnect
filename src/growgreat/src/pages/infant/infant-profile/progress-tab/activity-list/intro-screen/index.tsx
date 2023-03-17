import { Header } from '../../../components';
import Infant from '@/assets/infant.svg';
import { InfantDto } from '@ecdlink/core';
import { useMemo } from 'react';
import {
  Button,
  classNames,
  Colours,
  Divider,
  ProgressBar,
  renderIcon,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';

import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';

interface IntroScreenProps {
  infant?: InfantDto;
  onStartVisit: () => void;
}

interface IData {
  id: string;
  comment: string;
  color: string;
  type: string;
  section: string;
}

interface Status {
  success: IData;
  warning: IData;
  error: IData;
  none: IData;
}

// TODO: add all props
interface VisitStatus {
  breastfeedingIssues: Status;
  childDocumentation: Status;
  clinicReferrals: Status;
  dangerSigns: Status;
  departmentOfHomeAffairsReferrals: Status;
  growth: Status;
  maternalDistressScreening: Status;
  nutrition: Status;
  referToClinicUrgently: Status;
}

interface CardProps {
  label: string;
  value: string;
  date: string;
  icon: string;
  message: string;
  primaryColour: Colours;
  secondaryColour: Colours;
  className?: string;
}

interface InfoCardProps {
  icon: string;
  items: {
    icon?: string;
    customIcon?: string;
    title: string;
    list?: string[];
  }[];
  primaryColour: Colours;
  secondaryColour: Colours;
  className?: string;
}

const Card = ({
  className,
  label,
  value,
  date,
  icon,
  message,
  primaryColour,
  secondaryColour,
}: CardProps) => {
  return (
    <div
      className={classNames(
        className,
        `rounded-10 p-4 bg-${secondaryColour} flex`
      )}
    >
      <div className={`w-2/4 border-r border-dashed border-${primaryColour}`}>
        <Typography type="h4" text={label} />
        <span className="my-3 flex gap-1">
          <Typography
            type="h4"
            className="text-3xl"
            color={primaryColour}
            text={value}
          />
          <Typography type="body" color="textMid" text="kg" />
        </span>
        <Typography color="textMid" type="body" text={date} />
      </div>
      <div className="flex w-2/4 flex-col items-center justify-center text-center">
        {renderIcon(icon, `w-5 h-5 text-${primaryColour}`)}
        <Typography color="textMid" type="body" text={message} />
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  items,
  primaryColour,
  secondaryColour,
  className,
}: InfoCardProps) => (
  <div
    className={classNames(
      className,
      `bg-${secondaryColour} border-2 border-${primaryColour} rounded-10 relative px-4 pt-8`
    )}
  >
    <span className="absolute rounded-full bg-white" style={{ top: -14 }}>
      {renderIcon(icon, `w-7 h-7 text-${primaryColour}`)}
    </span>
    {items.map((item) => (
      <div key={item.title} className="mb-4 flex gap-2">
        <RoundIcon
          imageUrl={item.customIcon}
          icon={item.icon}
          iconColor="white"
          backgroundColor="tertiary"
        />
        <div>
          <Typography color="textMid" type="h4" text={item.title} />
          {item?.list?.map((currentItem) => (
            <li key={currentItem} className="text-textMid">
              {currentItem}
            </li>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const mocked_data = {
  date: '2 Sep 2021',
  value: '4.2',
  message: 'Growth faltering: weight has not increased',
};

export const IntroScreen = ({ infant, onStartVisit }: IntroScreenProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  function toCamelCase(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  const groupedDataByType = useMemo(() => {
    const result = previousVisit?.visitDataStatus?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const type = toCamelCase(currentValue?.type || '');
        if (!type) return acc;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(currentValue);
        return acc;
      },
      {}
    );

    return result;
  }, [previousVisit?.visitDataStatus]);

  // TODO: remove this console
  console.log({ groupedDataByType });

  const groupedData = useMemo(() => {
    const groupedData = previousVisit?.visitDataStatus?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const section = toCamelCase(currentValue?.section || '');
        const color = toCamelCase(currentValue?.color || '');

        if (!section || !color) return acc;

        if (!acc[color]) {
          acc[color] = {};
        }

        if (!acc[color][section]) {
          acc[color][section] = [];
        }

        acc[color][section].push(currentValue);
        return acc;
      },
      {}
    );

    return groupedData;
  }, [previousVisit?.visitDataStatus]) as VisitStatus | undefined;

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={`Summary of your last visit with ${name}`}
      />
      <div className="p-4">
        <div className="flex gap-4">
          <Typography
            className="w-2/4"
            type="h4"
            text={`Lorem ipsum Lorem ipsum Lorem ipsum`}
          />
          <div className="w-2/4">
            <ProgressBar
              className="h-2"
              label={previousVisit?.score || ''}
              subLabel="score"
              value={40}
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-8" />
        <Typography
          className="mb-4"
          type="h4"
          text={`Here is a summary of how ${name} & ${caregiverName} are doing`}
        />
        {['Weight', 'Length', 'MUAC'].map((label) => (
          <Card
            key={label}
            className="my-4"
            label={label}
            value={mocked_data.value}
            date={mocked_data.date}
            icon="ExclamationIcon"
            message="Growth faltering: weight has not increased"
            primaryColour="alertMain"
            secondaryColour="uiBg"
          />
        ))}
        <Divider dividerType="dashed" className="mt-4 mb-8" />
        {!!groupedData &&
          Object.keys(groupedData).map((item) => (
            <InfoCard
              key={item}
              className="my-6"
              icon="ExclamationCircleIcon"
              items={[
                {
                  customIcon: Infant,
                  title: 'Lethabo is experiencing maternal distress:',
                  list: [
                    'Felt unable to stop worrying',
                    'Had thoughts and plans to harm herself or commit suicide',
                  ],
                },
                {
                  customIcon: Infant,
                  title: 'Missed 6 week immunisation',
                },
              ]}
              primaryColour="errorMain"
              secondaryColour="errorBg"
            />
          ))}
        <Button
          className="mt-8 w-full"
          type="filled"
          color="primary"
          textColor="white"
          icon="ClipboardListIcon"
          text="Start visit"
          onClick={onStartVisit}
        />
      </div>
    </>
  );
};
