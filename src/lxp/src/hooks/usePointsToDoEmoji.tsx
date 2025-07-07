import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  CalendarIcon,
  ClipboardCheckIcon,
  FireIcon,
} from '@heroicons/react/solid';
import { ReactComponent as Kindgarden } from '@/assets/icon/kindergarten1.svg';
import { ReactComponent as Crown } from '@/assets/icon/crown.svg';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import { useTenant } from './useTenant';

export const usePointsToDoEmoji = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  const tenant = useTenant();

  const planActivitiesPermission = useMemo(
    () =>
      practitioner?.permissions?.find(
        (item) =>
          item?.permissionName === PermissionsNames.plan_classroom_actitivies
      ),
    [practitioner?.permissions]
  );

  const renderPointsToDoEmoji = useMemo(() => {
    let communityColor = 'bg-quatenary';

    if (pointsToDo?.viewedCommunitySection) {
      if (practitioner?.isPrincipal) {
        if (pointsToDo.savedIncomeOrExpense) {
          communityColor = 'bg-successMain';
        }
      } else {
        if (
          planActivitiesPermission &&
          planActivitiesPermission?.isActive &&
          pointsToDo.plannedOneDay
        ) {
          communityColor = 'bg-successMain';
        }
      }
      return (
        <div className={`${communityColor} mr-4 rounded-full p-3`}>
          <FireIcon className="font-white h-6 w-6 text-white" />
        </div>
      );
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <Crown className="font-white h-6 w-6 text-white" />
        </div>
      );
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <CalendarIcon className="font-white h-6 w-6 text-white" />
        </div>
      );
    }

    if (
      tenant?.isWhiteLabel
        ? pointsToDo?.isPartOfPreschool
        : pointsToDo?.isPartOfPreschool && practitioner?.progress === 2
    ) {
      return (
        <div className="bg-secondary mr-4 rounded-full p-3">
          <Kindgarden className="font-white h-6 w-6 text-white" />
        </div>
      );
    }

    if (pointsToDo?.signedUpForApp) {
      return (
        <div className="bg-alertMain mr-4 rounded-full p-2">
          <ClipboardCheckIcon className="font-white h-6 w-6 text-white" />
        </div>
      );
    }

    return (
      <div className="bg-alertMain mr-4 rounded-full p-2">
        <ClipboardCheckIcon className="font-white h-6 w-6 text-white" />
      </div>
    );
  }, [
    pointsToDo?.viewedCommunitySection,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.plannedOneDay,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.signedUpForApp,
    practitioner?.isPrincipal,
    practitioner?.progress,
    planActivitiesPermission,
    tenant?.isWhiteLabel,
  ]);

  return {
    renderPointsToDoEmoji,
  };
};
