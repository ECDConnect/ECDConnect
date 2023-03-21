import { Header } from '../../../components';
import { InfantDto, toCamelCase } from '@ecdlink/core';
import { useCallback, useMemo } from 'react';
import { Button, Colours, Divider, ProgressBar, Typography } from '@ecdlink/ui';

import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { Card, CardProps } from './components/card';
import { GrowthCard } from './components/growth-card';
import { InfoCard, Item } from './components/info-card';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P4 from '@/assets/pillar/p4.svg';
import P5 from '@/assets/pillar/p5.svg';
import { activitiesColours, activitiesTypes } from '../activities-list';
import { VisitDataStatus } from '@ecdlink/graphql';

interface IntroScreenProps {
  infant?: InfantDto;
  onStartVisit: () => void;
}

interface Status {
  success: VisitDataStatus[];
  warning: VisitDataStatus[];
  error: VisitDataStatus[];
  none: VisitDataStatus[];
}

type StatusType = keyof Status;

export const IntroScreen = ({ infant, onStartVisit }: IntroScreenProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const getColorAndIcon = useCallback(
    (
      color: string
    ): { primaryColour: Colours; secondaryColour: Colours; icon: string } => {
      const formattedColor = color.toLowerCase();
      switch (formattedColor) {
        case 'warning':
          return {
            primaryColour: 'alertMain',
            secondaryColour: 'alertBg',
            icon: 'ExclamationIcon',
          };
        case 'error':
          return {
            primaryColour: 'errorMain',
            secondaryColour: 'errorBg',
            icon: 'ExclamationCircleIcon',
          };
        case 'success':
        default:
          return {
            primaryColour: 'successMain',
            secondaryColour: 'successBg',
            icon: 'BadgeCheckIcon',
          };
      }
    },
    []
  );

  const { weight, length, muac, grow } = useMemo(() => {
    const weight = {
      name: 'Weight',
      value: previousVisit?.weight,
      color: previousVisit?.weightColor,
      comment: previousVisit?.weightComment,
    };
    const length = {
      name: 'Length',
      value: previousVisit?.length,
      color: previousVisit?.lengthColor,
      comment: previousVisit?.lengthComment,
    };
    const muac = {
      name: 'MUAC',
      value: previousVisit?.muac,
      color: previousVisit?.muacColor,
      comment: previousVisit?.muacComment,
    };
    const grow = {
      comment: previousVisit?.growComment,
      color: previousVisit?.growCommentColor,
    };

    return { weight, length, muac, grow };
  }, [previousVisit]);

  const progressBarOptions = useMemo((): {
    primaryColour: Colours;
    secondaryColour: Colours;
    value: number;
    message: string;
  } => {
    switch (previousVisit?.scoreColor) {
      case 'Error':
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          message: `${caregiverName} & ${name} need urgent support`,
          value: 25,
        };
      case 'Warning':
        return {
          primaryColour: 'alertMain',
          secondaryColour: 'alertBg',
          message: `${caregiverName} & ${name} need support`,
          value: 50,
        };
      case 'Success':
      default:
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          message: `${caregiverName} & ${name} are going well`,
          value: 100,
        };
    }
  }, [caregiverName, name, previousVisit?.scoreColor]);

  const getVisitIcon = (visitName: string) => {
    switch (visitName) {
      case activitiesTypes.careForMom:
        return { icon: Pregnant, color: activitiesColours.other.primaryColor };
      case activitiesTypes.careForBaby:
        return { icon: Infant, color: activitiesColours.other.primaryColor };
      case activitiesTypes.pillar1:
        return { icon: P1, color: activitiesColours.pillar1.primaryColor };
      case activitiesTypes.pillar2:
        return { icon: P2, color: activitiesColours.pillar2.primaryColor };
      case activitiesTypes.pillar3:
        return { icon: P3, color: activitiesColours.pillar3.primaryColor };
      case activitiesTypes.pillar4:
        return { icon: P4, color: activitiesColours.pillar4.primaryColor };
      default:
        return { icon: P5, color: activitiesColours.pillar5.primaryColor };
    }
  };

  const groupedData = useMemo(() => {
    const groupedData = previousVisit?.visitDataStatus?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const color = toCamelCase(currentValue?.color || '');
        if (!color) return acc;
        if (!acc[color]) {
          acc[color] = [];
        }
        acc[color].push(currentValue);
        return acc;
      },
      {}
    );

    return groupedData;
  }, [previousVisit?.visitDataStatus]) as Status | undefined;

  return (
    <>
      {/* TODO(header): add age and date (G5.0.1) */}
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={`Summary of your last visit with ${name}`}
      />
      <div className="p-4 pt-8">
        <div className="flex gap-4">
          <Typography
            className="w-2/4"
            type="h4"
            text={progressBarOptions.message}
          />
          <div className="w-2/4">
            <ProgressBar
              className="h-2"
              label={previousVisit?.score || ''}
              subLabel="score"
              value={progressBarOptions.value}
              primaryColour={progressBarOptions.primaryColour}
              secondaryColour={progressBarOptions.secondaryColour}
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-8" />
        <Typography
          className="mb-8"
          type="h4"
          text={`Here is a summary of how ${name} & ${caregiverName} are doing`}
        />
        <GrowthCard
          text={grow.comment || ''}
          color={getColorAndIcon(grow.color || '').primaryColour}
          icon={getColorAndIcon(grow.color || '').icon}
        />
        {[weight, length, muac].map((item) => (
          <Card
            key={item.name}
            className="my-4"
            label={item.name}
            value={item.value || ''}
            date={
              previousVisit?.visitDataStatus?.[0]?.insertedDate || ''
            } /* TODO: add the correct date */
            message={item.comment || ''}
            color={item.color as CardProps['color']}
          />
        ))}
        <Divider dividerType="dashed" className="mt-4 mb-8" />
        {!!groupedData &&
          Object.keys(groupedData).map((item, index) => {
            const { icon, primaryColour, secondaryColour } =
              getColorAndIcon(item);

            const dataByStatus = groupedData[item as StatusType];
            const uniqueData = dataByStatus.filter((object, index, array) => {
              return (
                index ===
                array.findIndex(
                  (newObject) => newObject.comment === object.comment
                )
              );
            });

            return (
              <InfoCard
                key={index}
                className="my-6"
                icon={icon}
                items={uniqueData.map((data): Item => {
                  const { icon, color } = getVisitIcon(
                    data?.visitData?.visitName || ''
                  );
                  return {
                    customIcon: icon,
                    iconHexBackgroundColour: color,
                    title: `${data.comment}`,
                  };
                })}
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
              />
            );
          })}
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
