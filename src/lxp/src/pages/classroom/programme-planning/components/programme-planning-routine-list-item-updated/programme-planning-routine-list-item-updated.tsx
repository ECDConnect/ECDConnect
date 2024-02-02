import {
  RoundIcon,
  StatusChip,
  renderIcon,
  Card,
  Typography,
  DialogPosition,
} from '@ecdlink/ui/';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import { activitySelectors } from '@store/content/activity';
import { useSelector } from 'react-redux';
import { ProgrammePlanningRoutineListItemProps } from './programme-planning-routine-list-item-updated.types';
import {
  getActivityIdForRoutineItem,
  getRoutineItemType,
} from '@utils/classroom/programme-planning/programmes.utils';
import BaseListItemUpdated from '../base-list-item-updated/base-list-item-updated';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const ProgrammePlanningRoutineListItemUpdated: React.FC<
  ProgrammePlanningRoutineListItemProps
> = ({ routineItem, onClick, day, selectedDate }) => {
  const dialog = useDialog();

  const { isOnline } = useOnlineStatus();

  const routineType = getRoutineItemType(routineItem.name);
  const canLinkActionToType =
    routineType === DailyRoutineItemType.smallGroup ||
    routineType === DailyRoutineItemType.largeGroup ||
    routineType === DailyRoutineItemType.storyBook;
  const isMessageBoard =
    routineType === DailyRoutineItemType.messageBoard ||
    routineType === DailyRoutineItemType.greeting;
  const activity = useSelector(
    activitySelectors.getActivityById(
      getActivityIdForRoutineItem(routineItem.name, day)
    )
  );

  const isPastDay = () => {
    if (selectedDate) {
      if (selectedDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleOnClick = () => {
    if (isPastDay()) {
      return;
    } else if (isOnline || (!isOnline && !!activity?.name)) {
      return onClick();
    }
    return showOnlineOnly();
  };

  const getTitle = () => {
    if (
      routineType === DailyRoutineItemType.largeGroup ||
      routineType === DailyRoutineItemType.smallGroup
    ) {
      return `${routineItem.name} activity`;
    }

    if (routineType === DailyRoutineItemType.storyBook) {
      return 'Story & activity';
    }

    return routineItem.name;
  };

  const getSubTitle = () => {
    if (canLinkActionToType) {
      if (!activity) return '';

      return activity.name;
    }

    if (isMessageBoard) return day?.messageBoardText || 'Optional';

    return '';
  };

  const getTitleTextType = () => {
    if (canLinkActionToType && activity) return 'small';

    return 'body';
  };

  const getSubTitleTextType = () => {
    if (canLinkActionToType && activity) return 'body';

    return 'small';
  };

  // const getRoutineItemActionIcon = () => {
  //   if (canLinkActionToType) {
  //     if (!activity) return 'ChevronRightIcon';
  //     return 'CheckCircleIcon';
  //   }
  //   if (routineItem.name === 'Greeting' || routineItem.name === 'Free play')
  //     return 'QuestionMarkCircleIcon';
  //   return 'ChevronRightIcon';
  // };

  const getRoutineItemPostSlotRender = () => {
    if (
      routineItem.name === DailyRoutineItemType.messageBoard ||
      routineItem.name === DailyRoutineItemType.greeting ||
      routineItem.name === DailyRoutineItemType.freePlay
    ) {
      return (
        <Card className="bg-primaryAccent1 w-full rounded-xl py-4 px-2">
          <div className={'flex w-full flex-row items-center justify-between'}>
            <Typography
              type={'help'}
              text={routineItem?.name}
              color={'white'}
            />
            <div className="flex">
              <Typography
                type={'help'}
                text={routineItem.timeSpan}
                color={'white'}
              />

              {renderIcon('ClockIcon', `w-5 h-5 text-white ml-1`)}
            </div>
          </div>
        </Card>
      );
    }
    if (!activity?.name && !isPastDay()) {
      return (
        <Card className="border-secondary w-full rounded-xl border-2 bg-white py-4 px-2">
          <div
            className={
              'ml-4 flex w-full flex-row items-center justify-start gap-4'
            }
          >
            <Typography type={'h1'} text={'+'} color={'secondary'} />
            <Typography type={'h4'} text={'Add Activity'} color={'secondary'} />

            {renderIcon('ClockIcon', `w-5 h-5 text-white ml-1`)}
          </div>
        </Card>
      );
    } else if (!activity?.name && isPastDay()) {
      return (
        <Card className="bg-primaryAccent2 w-full rounded-xl py-4 px-2">
          <div
            className={
              'ml-4 flex w-full flex-row items-center justify-start gap-4'
            }
          >
            <Typography type={'h1'} text={'+'} color={'primaryAccent1'} />
            <Typography
              type={'h4'}
              text={'Add Activity'}
              color={'primaryAccent1'}
            />
          </div>
        </Card>
      );
    } else {
      return (
        <Card className="bg-secondary w-full rounded-xl py-4 px-2">
          <div className={'flex w-full flex-row items-center justify-between'}>
            <Typography
              type={'help'}
              // className={'text-white'}
              text={activity ? activity.name : ''}
              color={'white'}
            />
            <StatusChip
              className={'mr-2'}
              padding={'px-2 py-1'}
              backgroundColour={'secondaryAccent1'}
              text={routineItem.timeSpan}
              textColour={'white'}
              borderColour={'secondaryAccent1'}
            >
              {renderIcon('ClockIcon', `w-5 h-5 text-white ml-1`)}
            </StatusChip>
          </div>
        </Card>
      );
    }
  };

  const getRoutineItemPreSlotRender = () => {
    // if (
    //   routineItem.name === DailyRoutineItemType.messageBoard &&
    //   day?.messageBoardText
    // ) {
    //   return (
    //     <div
    //       className={`bg-primary} mr-2 flex flex-row items-center justify-center rounded-full p-4`}
    //       style={{ backgroundColor: routineItem.iconBackgroundColor }}
    //     >
    //       <img
    //         className={'h-5 w-5'}
    //         src={routineItem.icon}
    //         alt="routine item"
    //       />
    //     </div>
    //   );
    // }
    if (activity) {
      return (
        <RoundIcon
          icon={'CheckIcon'}
          className={'bg-primary mr-2 text-white'}
        />
      );
    }

    return (
      <div
        className={`mr-2 flex flex-row items-center justify-center rounded-full p-4 bg-${
          canLinkActionToType || isMessageBoard ? 'uiLight' : 'primary'
        }`}
        style={{ backgroundColor: routineItem.iconBackgroundColor }}
      >
        <img className={'h-5 w-5'} src={routineItem.icon} alt="routine item" />
      </div>
    );
  };

  return (
    <BaseListItemUpdated
      backgroundColor={'white'}
      overwritePreSlotRender={getRoutineItemPreSlotRender}
      titleTypography={{
        type: getTitleTextType(),
        text: getTitle(),
        color: canLinkActionToType && activity ? 'textMid' : 'black',
        weight: canLinkActionToType && activity ? 'skinny' : 'bold',
      }}
      subTitleTypography={{
        type: getSubTitleTextType(),
        text: getSubTitle(),
        color: canLinkActionToType && activity ? 'black' : 'textMid',
        weight: canLinkActionToType && activity ? 'bold' : 'skinny',
      }}
      overwritePostSlotRender={getRoutineItemPostSlotRender}
      dividerType={'solid'}
      dividerColor={'uiLight'}
      onClick={handleOnClick}
      routineItem={routineItem}
    />
  );
};
