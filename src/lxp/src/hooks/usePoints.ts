import { practitionerSelectors } from '@/store/practitioner';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTenant } from './useTenant';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import { pointsSelectors } from '@/store/points';
import { Colours } from '@ecdlink/ui';

export const usePoints = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  const totalYearPoints = useSelector(pointsSelectors.getTotalYearPoints);

  const isPartOfPreschool = useMemo(
    () =>
      tenant.isWhiteLabel
        ? pointsToDo?.isPartOfPreschool
        : pointsToDo?.isPartOfPreschool && practitioner?.progress === 2,
    [tenant.isWhiteLabel, pointsToDo?.isPartOfPreschool, practitioner?.progress]
  );

  const planActivitiesPermission = useMemo(
    () =>
      practitioner?.permissions?.find(
        (item) =>
          item?.permissionName === PermissionsNames.plan_classroom_actitivies
      ),
    [practitioner?.permissions]
  );

  const phase1StatusText = useMemo(() => {
    // step 1 - all
    const umtsha = !isPartOfPreschool;
    // step 2 - all
    const tichere = isPartOfPreschool;
    // step 3a - principal
    const boss = practitioner?.isPrincipal
      ? pointsToDo?.savedIncomeOrExpense
      : false;
    // step 3b - practitioner
    const cwepheshe = !practitioner?.isPrincipal
      ? pointsToDo?.plannedOneDay &&
        planActivitiesPermission &&
        planActivitiesPermission?.isActive
      : false;
    // step 4 - all
    const influencer = pointsToDo?.viewedCommunitySection;

    // step 4
    if (influencer) return 'Influencer';
    // step 3
    if (boss) return 'Boss';
    if (cwepheshe) return 'Cwepheshe';
    // step 2
    if (tichere) return 'Tichere';
    // step 1
    if (umtsha) return 'Umtsha';
  }, [
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
    planActivitiesPermission,
    isPartOfPreschool,
  ]);

  const isPhase1Completed = useMemo(() => {
    const isCompleted =
      // WL
      tenant.isWhiteLabel
        ? practitioner?.isPrincipal
          ? isPartOfPreschool &&
            pointsToDo?.savedIncomeOrExpense &&
            pointsToDo?.signedUpForApp &&
            pointsToDo?.viewedCommunitySection
          : planActivitiesPermission && planActivitiesPermission?.isActive
          ? isPartOfPreschool &&
            pointsToDo?.plannedOneDay &&
            pointsToDo?.signedUpForApp &&
            pointsToDo?.viewedCommunitySection
          : isPartOfPreschool &&
            pointsToDo?.signedUpForApp &&
            pointsToDo?.viewedCommunitySection
        : // OA
        practitioner?.isPrincipal
        ? isPartOfPreschool &&
          practitioner?.progress === 2 &&
          pointsToDo?.savedIncomeOrExpense &&
          pointsToDo?.signedUpForApp &&
          pointsToDo?.viewedCommunitySection
        : planActivitiesPermission && planActivitiesPermission?.isActive
        ? isPartOfPreschool &&
          practitioner?.progress === 2 &&
          pointsToDo?.plannedOneDay &&
          pointsToDo?.signedUpForApp &&
          pointsToDo?.viewedCommunitySection
        : isPartOfPreschool &&
          practitioner?.progress === 2 &&
          pointsToDo?.signedUpForApp &&
          pointsToDo?.viewedCommunitySection;
    return isCompleted;
  }, [
    practitioner?.isPrincipal,
    pointsToDo,
    planActivitiesPermission,
    isPartOfPreschool,
  ]);

  const showPhase2Card = isPhase1Completed && (totalYearPoints || 0) > 0;

  function removeMandatoryProperty<T, K extends keyof T>(
    obj: T,
    prop: K,
    condition: (value: T[K]) => boolean
  ): void {
    if (condition(obj[prop])) {
      delete (obj as any)[prop]; // Use type assertion to bypass TypeScript checks
    }
  }

  const getCurrentPointsToDo = useMemo(() => {
    if (pointsToDo) {
      let newPointsToDo = { ...pointsToDo };
      if (practitioner?.isPrincipal) {
        removeMandatoryProperty(
          newPointsToDo,
          'plannedOneDay',
          (value) => practitioner?.isPrincipal === true
        );
      } else {
        removeMandatoryProperty(
          newPointsToDo,
          'savedIncomeOrExpense',
          (value) => !practitioner?.isPrincipal
        );
      }

      const pointsToDoValues = Object.values(newPointsToDo!)?.filter(
        (item) => item === true
      );
      return pointsToDoValues?.length;
    } else {
      return 0;
    }
  }, [pointsToDo, practitioner?.isPrincipal]);

  const renderPointsToDoProgressBarColor: Colours = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (practitioner?.isPrincipal) {
        if (!pointsToDo?.savedIncomeOrExpense) {
          return 'quatenary';
        }
      } else {
        if (!pointsToDo.plannedOneDay) {
          return 'quatenary';
        }
      }

      return 'successMain';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenary';
    }

    if (isPartOfPreschool) {
      return 'secondary';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertMain';
    }

    return 'alertMain';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
    isPartOfPreschool,
  ]);

  const renderPointsToDoScoreCardBgColor: Colours = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (practitioner?.isPrincipal) {
        if (!pointsToDo?.savedIncomeOrExpense) {
          return 'quatenaryBg';
        }
      } else {
        if (!pointsToDo.plannedOneDay) {
          return 'quatenaryBg';
        }
      }

      return 'successBg';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenaryBg';
    }

    if (isPartOfPreschool) {
      return 'secondaryAccent2';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertBg';
    }

    return 'alertBg';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission,
    isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  return {
    phase1StatusText,
    isPhase1Completed,
    showPhase2Card,
    getCurrentPointsToDo,
    renderPointsToDoProgressBarColor,
    renderPointsToDoScoreCardBgColor,
    isPartOfPreschool,
  };
};
