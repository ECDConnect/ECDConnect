import { BaseListItem, RoundIcon, StatusChip, renderIcon } from '@ecdlink/ui/';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import { activitySelectors } from '@store/content/activity';
import { useSelector } from 'react-redux';
import { ProgrammePlanningRoutineListItemProps } from './programme-planning-routine-list-item.types';
import {
  getActivityIdForRoutineItem,
  getRoutineItemType,
} from '@utils/classroom/programme-planning/programmes.utils';
import ProgrammeBaseListItem from '../programme-base-list-item/programme-base-list-item';

export const ProgrammePlanningRoutineListItem: React.FC<
  ProgrammePlanningRoutineListItemProps
> = ({ routineItem, onClick, day }) => {
  const routineType = getRoutineItemType(routineItem.name);
  const canLinkActionToType =
    routineType === DailyRoutineItemType.smallGroup ||
    routineType === DailyRoutineItemType.largeGroup ||
    routineType === DailyRoutineItemType.storyBook;
  const isMessageBoard =
    // routineType === DailyRoutineItemType.messageBoard ||
    routineType === DailyRoutineItemType.greeting;
  const activity = useSelector(
    activitySelectors.getActivityById(
      getActivityIdForRoutineItem(routineItem.name, day)
    )
  );

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

  const getRoutineItemActionIcon = () => {
    if (canLinkActionToType) {
      if (!activity) return 'ChevronRightIcon';

      return 'CheckCircleIcon';
    }

    if (routineItem.name === 'Greeting' || routineItem.name === 'Free play')
      return 'QuestionMarkCircleIcon';

    return 'ChevronRightIcon';
  };

  const getRoutineItemPostSlotRender = () => {
    return (
      <div className={'flex w-full flex-row items-center justify-end'}>
        <StatusChip
          className={'mr-2'}
          padding={'px-2 py-1'}
          backgroundColour={'infoBb'}
          text={routineItem.timeSpan}
          textColour={'infoDark'}
          borderColour={'infoBb'}
        >
          {renderIcon('ClockIcon', `w-5 h-5 text-infoDark ml-1`)}
        </StatusChip>
        {renderIcon(
          getRoutineItemActionIcon(),
          `w-5 h-5 flex-shrink-0 text-${
            canLinkActionToType && activity ? 'successMain' : 'uiMid'
          } ml-1`
        )}
      </div>
    );
  };

  const getRoutineItemPreSlotRender = () => {
    if (
      routineItem.name === DailyRoutineItemType.messageBoard &&
      day?.messageBoardText
    ) {
      return (
        <div
          className={`bg-primary} mr-2 flex flex-row items-center justify-center rounded-full p-4`}
          style={{ backgroundColor: routineItem.iconBackgroundColor }}
        >
          <img
            className={'h-5 w-5'}
            src={routineItem.icon}
            alt="routine item"
          />
        </div>
      );
    }
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
    <ProgrammeBaseListItem
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
      onClick={onClick}
    />
  );
};
