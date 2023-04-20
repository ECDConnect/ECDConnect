import { Colours, Divider, ProgressBar, Typography } from '@ecdlink/ui';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import { MotherDto, toCamelCase } from '@ecdlink/core';
import { VisitDataStatus } from '@ecdlink/graphql';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import BabyHealthcare from '@/assets/iconCircleAntenatalSmall.svg';
import P1 from '@/assets/pillar/p1.svg';
import P5 from '@/assets/pillar/p5.svg';
import { ReactComponent as Home } from '@/assets/home.svg';

import {
  activitiesColours,
  activitiesSectionTypes,
} from '../../../activities-list';
import { InfoCard, Item } from './info-card';

interface FollowUpComponentProps {
  mother: MotherDto;
}

interface Status {
  success: VisitDataStatus[];
  warning: VisitDataStatus[];
  error: VisitDataStatus[];
  none: VisitDataStatus[];
}

type StatusType = keyof Status;

export const FollowUp = ({ mother }: FollowUpComponentProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const previousVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
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
          message: `${name} need support`,
          value: 50,
        };
      case 'Success':
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          message: `${name} are going well`,
          value: 100,
        };
      case 'Error':
      default:
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          message: `${name} need urgent support`,
          value: 25,
        };
    }
  }, [name, previousVisit?.scoreColor]);

  const getVisitIcon = (visitName: string) => {
    switch (visitName) {
      case activitiesSectionTypes.healthCare:
        return {
          icon: BabyHealthcare,
          color: activitiesColours.other.primaryColor,
        };
      case activitiesSectionTypes.nutrition:
        return { icon: P1, color: '#8CDBDF' };
      case activitiesSectionTypes.pregnancyCare:
        return { icon: P1, color: activitiesColours.pillar1.primaryColor };
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
            text={`You haven't visited ${name} yet`}
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
        <div className="h-16 w-2/4">
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
        text={`Here is a summary of how ${name} is doing:`}
      />

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
                const { icon, color } = getVisitIcon(data?.section || '');
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
