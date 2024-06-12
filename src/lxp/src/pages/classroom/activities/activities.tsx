import ROUTES from '@/routes/routes';
import { classroomsSelectors } from '@/store/classroom';
import { programmeSelectors } from '@/store/programme';
import { getAvatarColor } from '@ecdlink/core';
import {
  CelebrationCard,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { isSameDay, parseISO, isAfter } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { useState } from 'react';

export const ActivitiesTab = () => {
  const [displayCelebrationCard, setDisplayCelebrationCard] = useState(true);

  const classes = useSelector(classroomsSelectors.getClassroomGroups);
  const programmes = useSelector(programmeSelectors.getProgrammes);

  const history = useHistory();

  const today = new Date();

  const classList: UserAlertListDataItem[] = classes?.map((currentClass) => ({
    title: currentClass.name,
    profileText: currentClass.name.slice(0, 2).toUpperCase(),
    subTitle:
      programmes?.find(
        (theme) =>
          theme.classroomGroupId === currentClass.id &&
          theme.dailyProgrammes?.some(
            (day) =>
              isSameDay(parseISO(day.dayDate), today) ||
              isAfter(parseISO(day.dayDate), today)
          )
      )?.name || 'No theme',
    alertSeverity: 'none',
    avatarColor: getAvatarColor(),
    iconColor: 'secondary',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.replace(
          ':classroomGroupId',
          currentClass.id
        )
      ),
  }));

  const isToShowCelebratoryCard = classList?.every(
    (item) => item.subTitle !== 'No theme'
  );

  return (
    <div className="p-4">
      {isToShowCelebratoryCard && displayCelebrationCard && (
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
      <StackedList
        className="mb-20 flex flex-col gap-1"
        type="UserAlertList"
        listItems={classList}
      />
    </div>
  );
};
