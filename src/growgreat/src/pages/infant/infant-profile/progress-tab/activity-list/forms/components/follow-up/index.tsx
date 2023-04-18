import { Colours, Divider, ProgressBar, Typography } from '@ecdlink/ui';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { InfantDto, toCamelCase } from '@ecdlink/core';
import { VisitDataStatus } from '@ecdlink/graphql';
import { Fragment, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P4 from '@/assets/pillar/p4.svg';
import P5 from '@/assets/pillar/p5.svg';
import { ReactComponent as Home } from '@/assets/home.svg';

import { activitiesColours, activitiesTypes } from '../../../activities-list';
import { InfoCard, Item } from './info-card';
import { Card, CardProps } from './card';
import { GrowthCard } from './growth-card';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import { RootState } from '@/store/types';
import {
  getInfantPreviousVisitSelector,
  getInfantVisitByVisitIdSelector,
} from '@/store/infant/infant.selectors';

interface FollowUpComponentProps {
  infant: InfantDto;
}

interface Status {
  success: VisitDataStatus[];
  warning: VisitDataStatus[];
  error: VisitDataStatus[];
  none: VisitDataStatus[];
}

type StatusType = keyof Status;

export const FollowUp = ({ infant }: FollowUpComponentProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const { visitId } = useParams<InfantProfileParams>();

  const visit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, visit?.plannedVisitDate || '')
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
      case 'Warning':
        return {
          primaryColour: 'alertMain',
          secondaryColour: 'alertBg',
          message: `${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${name} need support`,
          value: 50,
        };
      case 'Success':
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          message: `${!!caregiverName ? caregiverName + ' &' : ''} ${name} ${
            !!caregiverName ? 'are' : 'is'
          } going well`,
          value: 100,
        };
      case 'Error':
      default:
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          message: `${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${name} need urgent support`,
          value: 25,
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

  if (!previousVisit?.visitDataStatus?.length) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center gap-4">
        <Home />
        <div className="h-24">
          <Typography
            type="h3"
            align="center"
            text={`You haven’t visited ${caregiverName} & ${name} yet`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
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
        text={`Here is a summary of how ${name} ${
          !!caregiverName ? '& ' + caregiverName : ''
        } ${!!caregiverName ? 'are' : 'is'} doing`}
      />
      {grow.comment && (
        <GrowthCard
          text={grow.comment || ''}
          color={getColorAndIcon(grow.color || '').primaryColour}
          icon={getColorAndIcon(grow.color || '').icon}
        />
      )}
      {[weight, length, muac].map((item) => {
        if (!item.value) return <Fragment key={item.name} />;

        return (
          <Card
            key={item.name}
            className="my-4"
            label={item.name}
            value={item.value || ''}
            date={previousPlannedVisit?.plannedVisitDate || ''}
            message={item.comment || ''}
            color={item.color as CardProps['color']}
          />
        );
      })}
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
    </>
  );
};
