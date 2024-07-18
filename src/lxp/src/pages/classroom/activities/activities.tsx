import ROUTES from '@/routes/routes';
import { classroomsSelectors } from '@/store/classroom';
import { programmeSelectors } from '@/store/programme';
import { DailyProgrammeDto, ProgrammeDto, getAvatarColor } from '@ecdlink/core';
import {
  CelebrationCard,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { isSameDay, parseISO, isAfter, isBefore } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { useState } from 'react';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { practitionerSelectors } from '@/store/practitioner';

export const ActivitiesTab = () => {
  const [displayCelebrationCard, setDisplayCelebrationCard] = useState(true);

  const classes = useSelector(classroomsSelectors.getClassroomGroups);
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const history = useHistory();

  const today = new Date();

  const getProgrammeName = (currentClass: ClassroomGroupDto) => {
    const todayProgramme = programmes?.find((programme) =>
      programme.dailyProgrammes?.some(
        (day) =>
          programme.classroomGroupId === currentClass.id &&
          isSameDay(parseISO(day.dayDate.replace('Z', '')), today)
      )
    );

    if (todayProgramme && todayProgramme?.name !== 'No theme') {
      return todayProgramme.name;
    }

    const closestFutureProgramme = programmes?.reduce(
      // TODO: Check interface warning
      // @ts-ignore
      (closest: ProgrammeDto | undefined, programme: ProgrammeDto) => {
        if (programme.classroomGroupId === currentClass.id) {
          const futureDays = programme.dailyProgrammes?.filter((day) =>
            isAfter(parseISO(day.dayDate.replace('Z', '')), today)
          );

          if (futureDays && futureDays.length > 0) {
            const closestDay = futureDays.reduce(
              (
                nearest: DailyProgrammeDto | undefined,
                day: DailyProgrammeDto
              ) => {
                const currentDayDate = parseISO(day.dayDate.replace('Z', ''));
                if (
                  !nearest ||
                  isBefore(
                    currentDayDate,
                    parseISO(nearest.dayDate.replace('Z', ''))
                  )
                ) {
                  return day;
                }
                return nearest;
              },
              undefined
            );

            if (
              !closest ||
              (closestDay &&
                isBefore(
                  parseISO(closestDay.dayDate.replace('Z', '')),
                  parseISO(closest.dailyProgrammes![0].dayDate.replace('Z', ''))
                ))
            ) {
              return { ...programme, dailyProgrammes: [closestDay] };
            }
          }
        }
        return closest;
      },
      undefined
    );

    return closestFutureProgramme?.name || 'No theme';
  };

  const classList: UserAlertListDataItem[] = classes?.map((currentClass) => ({
    title: currentClass.name,
    profileText: currentClass.name.slice(0, 2).toUpperCase(),
    subTitle: getProgrammeName(currentClass),
    alertSeverity: 'none',
    avatarColor: getAvatarColor(),
    iconColor: 'secondary',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
          ':classroomGroupId',
          currentClass.id
        )
      ),
  }));

  const isToShowCelebratoryCard =
    classList?.length &&
    classList?.every((item) => item.subTitle !== 'No theme');

  return (
    <div className="p-4">
      {!!isToShowCelebratoryCard && !!displayCelebrationCard && (
        <CelebrationCard
          className="mb-4"
          onDismiss={() => setDisplayCelebrationCard(false)}
          secondaryTextColour="white"
          secondaryMessage=""
          primaryTextColour="white"
          image={<Emoji3 className="mt-2 h-16" />}
          backgroundColour="successMain"
          primaryMessage="Great job! You have activities planned for all classes!"
        />
      )}
      {classList.length ? (
        <StackedList
          className="mb-20 flex flex-col gap-1"
          type="UserAlertList"
          listItems={classList}
        />
      ) : (
        <IconInformationIndicator
          title="You don't have any classes yet!"
          subTitle={
            practitioner?.isPrincipal
              ? 'Go to the "Classes" tab to add a class.'
              : 'Ask your principal to assign you to a class.'
          }
        />
      )}
    </div>
  );
};
