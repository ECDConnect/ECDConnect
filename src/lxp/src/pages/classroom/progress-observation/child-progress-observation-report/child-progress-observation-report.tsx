import { useQueryParams, useStepNavigation } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import { ChildEnjoys } from './components/child-enjoys/child-enjoys';
import { ChildEnjoysFormModel } from '@schemas/classroom/child-progress-observations/child-enjoys-form';
import { ChildProgressReportOverview } from './components/child-progress-report-overview/child-progress-report-overview';
import { ChildProgressedWith } from './components/child-progressed-with/child-progressed-with';
import { ChildProgressedWithFormModel } from '@schemas/classroom/child-progress-observations/child-progressed-with-form';
import { CaregiverCanHelpChildWith } from './components/how-caregiver-can-help-child/how-caregiver-can-help-child';
import { CaregiverCanHelpChildWithFormModel } from '@schemas/classroom/child-progress-observations/how-caregiver-can-help-child-form';
import {
  ChildProgressObservationReportState,
  ChildProgressObservationReportSteps,
} from './child-progress-observation-report.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { contentReportSelectors } from '@store/content/report';
import { useEffect } from 'react';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';

export const ChildProgressObservationReport: React.FC = () => {
  const { state: routeState, search } =
    useLocation<ChildProgressObservationReportState>();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const childId = routeState?.childId;
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState.reportingDate)
    : new Date();
  const currentChild = useSelector(childrenSelectors.getChildById(childId));

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Progress Observation Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDate,
      childId
    )
  );
  const {
    currentReport,
    setChildEnjoys,
    setChildProgressedWith,
    setHowCategiverCanHelpChild,
  } = useChildProgressObservation(childId, report);
  const { getValue: getQueryParamValue } = useQueryParams(search);
  const stepDefinedInQueryParams = getQueryParamValue('step');

  const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
    useStepNavigation(
      Number(stepDefinedInQueryParams) ||
        ChildProgressObservationReportSteps.ChildEnjoys
    );

  const onBannerBack = () => {
    if (canGoBack()) {
      goBackOneStep();
      return;
    }

    history.goBack();
  };

  const onBannerClose = () => {
    history.goBack();
  };

  const onChildEnjoysSubmitted = (
    formValue: ChildEnjoysFormModel,
    exit: boolean
  ) => {
    setChildEnjoys(formValue.childEnjoys);
    goToStep(ChildProgressObservationReportSteps.ChildMadeProgressWith);
  };

  const onChildProgressedWithSubmitted = (
    formValue: ChildProgressedWithFormModel,
    exit: boolean
  ) => {
    setChildProgressedWith(formValue.childProgressedWith);
    goToStep(ChildProgressObservationReportSteps.HowCanCaregiverHelpChild);
  };

  const onHowCaregiverCanHelpChildSubmitted = (
    formValue: CaregiverCanHelpChildWithFormModel,
    exit: boolean
  ) => {
    setHowCategiverCanHelpChild(formValue.howCanCaregiverHelpChild);

    goToStep(ChildProgressObservationReportSteps.OverviewReport);
  };

  const renderStep = () => {
    switch (activeStepKey) {
      case ChildProgressObservationReportSteps.ChildEnjoys:
        return (
          <ChildEnjoys childId={childId} onSubmit={onChildEnjoysSubmitted} />
        );
      case ChildProgressObservationReportSteps.ChildMadeProgressWith:
        return (
          <ChildProgressedWith
            childId={childId}
            onSubmit={onChildProgressedWithSubmitted}
          />
        );
      case ChildProgressObservationReportSteps.HowCanCaregiverHelpChild:
        return (
          <CaregiverCanHelpChildWith
            childId={childId}
            onSubmit={onHowCaregiverCanHelpChildSubmitted}
          />
        );
      case ChildProgressObservationReportSteps.OverviewReport:
        return (
          <ChildProgressReportOverview
            childId={childId}
            reportingDate={reportingDate.toISOString()}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <BannerWrapper
      size={'small'}
      onBack={onBannerBack}
      onClose={onBannerClose}
      title={`${currentChild?.user?.firstName}'s ${currentReport?.reportingPeriod} report`}
      subTitle={`step ${activeStepKey} of 4`}
      displayOffline={!isOnline}
    >
      <div className={'mt-4 pb-4'}>{renderStep()}</div>
    </BannerWrapper>
  );
};
