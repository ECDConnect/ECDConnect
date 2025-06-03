import { practitionerSelectors } from '@/store/practitioner';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTenant } from './useTenant';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import { pointsSelectors } from '@/store/points';
import { useIsTrialPeriod } from './useIsTrialPeriod';
import { Colours } from '@ecdlink/ui';

export const usePoints = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  const isTrialPeriod = useIsTrialPeriod();
  const totalYearPoints = useSelector(pointsSelectors.getTotalYearPoints);

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
    const umtsha = isWhiteLabel
      ? !pointsToDo?.isPartOfPreschool
      : !pointsToDo?.isPartOfPreschool || isTrialPeriod;
    // step 2 - all
    const tichere = isWhiteLabel
      ? pointsToDo?.isPartOfPreschool
      : pointsToDo?.isPartOfPreschool && !isTrialPeriod;
    // step 3a - principal
    const boss = practitioner?.isPrincipal
      ? pointsToDo?.savedIncomeOrExpense
      : false;
    // step 3b - practitioner
    const cwepheshe = !practitioner?.isPrincipal
      ? pointsToDo?.plannedOneDay && planActivitiesPermission?.isActive
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
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
    planActivitiesPermission?.isActive,
  ]);
  const isPhase1Completed = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    return practitioner?.isPrincipal
      ? pointsToDo?.isPartOfPreschool &&
          pointsToDo?.savedIncomeOrExpense &&
          pointsToDo?.signedUpForApp &&
          pointsToDo?.viewedCommunitySection
      : planActivitiesPermission?.isActive
      ? pointsToDo?.isPartOfPreschool &&
        pointsToDo?.plannedOneDay &&
        pointsToDo?.signedUpForApp &&
        pointsToDo?.viewedCommunitySection
      : pointsToDo?.isPartOfPreschool &&
        pointsToDo?.signedUpForApp &&
        pointsToDo?.viewedCommunitySection;
  }, [
    practitioner?.isPrincipal,
    pointsToDo,
    planActivitiesPermission?.isActive,
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
      if (
        (getCurrentPointsToDo === 3 && practitioner?.isPrincipal) ||
        (!practitioner?.isPrincipal &&
          planActivitiesPermission?.isActive === true &&
          getCurrentPointsToDo === 3)
      ) {
        return 'quatenary';
      }
      return 'successMain';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenary';
    }

    if (pointsToDo?.isPartOfPreschool && !isTrialPeriod) {
      return 'secondary';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertMain';
    }

    return 'alertMain';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
    isTrialPeriod,
  ]);

  const renderPointsToDoScoreCardBgColor: Colours = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (
        (getCurrentPointsToDo === 3 && practitioner?.isPrincipal) ||
        (!practitioner?.isPrincipal &&
          planActivitiesPermission?.isActive === true &&
          getCurrentPointsToDo === 3)
      ) {
        return 'quatenaryBg';
      }
      return 'successBg';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenaryBg';
    }

    if (pointsToDo?.isPartOfPreschool && !isTrialPeriod) {
      return 'secondaryAccent2';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertBg';
    }

    return 'alertBg';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
    isTrialPeriod,
  ]);

  return {
    phase1StatusText,
    isPhase1Completed,
    showPhase2Card,
    getCurrentPointsToDo,
    renderPointsToDoProgressBarColor,
    renderPointsToDoScoreCardBgColor,
  };
};
