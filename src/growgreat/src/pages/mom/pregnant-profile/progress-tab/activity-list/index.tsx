import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Colours,
  DialogPosition,
  Dialog,
  LoadingSpinner,
  MenuListDataItem,
  renderIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import { activitiesList, activitiesTypes } from './activities-list';
import { Form } from './forms';
import { useWindowSize } from '@reach/window-size';
import { referralThunkActions } from '@/store/referral';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import {
  getMomCompletedVisitsByVisitIdSelector,
  getPreviousVisitInformationForMotherSelector,
} from '@/store/visit/visit.selectors';
import { IntroScreen } from './intro-screen';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { DevelopmentalScreeningVisitSection } from './forms/danger-signs-steps/developmental-screening-weeks';
import { muacFormSection } from './forms/nutrition-steps/mother-growth-muac';
import { HIVSection } from './forms/pregnancy-care-steps/nutrition/complementary-feeding-flow/hiv-care';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { userSelectors } from '@/store/user';
import { ActivityInfoPage } from './activity-info-page';
import { motherThunkActions } from '@/store/mother';
import {
  getIsMotherFirstVisitSelector,
  getMotherById,
  getMotherLastVisitSelector,
  getMotherFirstVisitSelector,
} from '@/store/mother/mother.selectors';
import { usePrevious } from '@ecdlink/core';
import { MotherActions } from '@/store/mother/mother.actions';
import { clinicVisitsSectionName } from './forms/healthcare-steps/clinic-visits';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export interface MotherProfileParams {
  id: string;
  visitId: string;
}

export const currentActivityKey = 'selectedOption';

export const MomActivityList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isShowCompletedForms, setIsShowCompletedForms] = useState(false);
  const [isStartVisit, setIsStartVisit] = useState(false);
  const [displayHelp, setDisplayHelp] = useState(false);
  const { visitId } = useParams<MotherProfileParams>();

  const selectedOption = window.sessionStorage.getItem(currentActivityKey);
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const [, , , motherId] = location.pathname.split('/');

  const { isLoading: isLoadingPreviousVisitData } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER
  );
  const { isLoading: isLoadingVisits } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_VISITS
  );
  const { isLoading: isLoadingVisitsAnswers } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_ANSWERS_FOR_MOTHER
  );
  const { isLoading: isLoadingCompletedVisits } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MOM_COMPLETED_VISITS_FOR_VISIT_ID
  );
  const { isLoading: isLoadingReferrals } = useThunkFetchCall(
    'visits',
    MotherActions.GET_REFERRALS_FOR_MOTHER
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MOTHER_SUMMARY_BY_PRIORITY
  );

  const isLoading =
    isLoadingPreviousVisitData ||
    isLoadingVisits ||
    isLoadingVisitsAnswers ||
    isLoadingCompletedVisits ||
    isLoadingReferrals ||
    isLoadingSummary;

  const currentVisit = useSelector((state: RootState) =>
    getMotherLastVisitSelector(state, visitId)
  );

  useLayoutEffect(() => {
    appDispatch(motherThunkActions?.getMotherVisits({ motherId }));
    appDispatch(
      referralThunkActions.getReferralsForVisitId({ visitId })
    ).unwrap();
  }, [appDispatch, motherId, visitId]);

  const firstVisit = useSelector(getMotherFirstVisitSelector);
  const previousCurrentVisit = useSelector(getMotherLastVisitSelector);
  const previousSelectedOption = usePrevious(selectedOption) as
    | string
    | undefined;

  useLayoutEffect(() => {
    if (
      !!previousCurrentVisit &&
      previousCurrentVisit?.id !== currentVisit?.id &&
      !!currentVisit
    ) {
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForMother({
          visitId: previousCurrentVisit?.id,
        })
      );
    } else {
      if (!previousCurrentVisit && !!currentVisit) {
        appDispatch(
          visitThunkActions.getPreviousVisitInformationForMother({
            visitId: currentVisit?.id,
          })
        );
      }
    }
  }, [
    appDispatch,
    visitId,
    currentVisit?.id,
    currentVisit,
    previousCurrentVisit,
  ]);

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getVisitAnswersForMother({
        visitId: visitId,
        visitName: activitiesTypes.nutrition,
        visitSection: DevelopmentalScreeningVisitSection,
      })
    );
  }, [visitId, appDispatch]);

  useLayoutEffect(() => {
    if (previousCurrentVisit?.id) {
      appDispatch(
        visitThunkActions.getVisitAnswersForMother({
          visitId: previousCurrentVisit.id,
          visitName: activitiesTypes.nutrition,
          visitSection: muacFormSection,
        })
      );
      appDispatch(
        visitThunkActions.getVisitAnswersForMother({
          visitId: previousCurrentVisit.id,
          visitName: activitiesTypes.healthCare,
          visitSection: clinicVisitsSectionName,
        })
      );
      appDispatch(
        visitThunkActions.getVisitAnswersForMother({
          visitId: previousCurrentVisit.id,
          visitName: activitiesTypes.pregnancyCare,
          visitSection: HIVSection,
        })
      );
    }
  }, [appDispatch, previousCurrentVisit?.id]);

  useLayoutEffect(() => {
    if (firstVisit?.id) {
      appDispatch(
        visitThunkActions.getVisitAnswersForMother({
          visitId: firstVisit.id,
          visitName: activitiesTypes.pregnancyCare,
          visitSection: HIVSection,
        })
      );
    }
  }, [appDispatch, firstVisit?.id]);

  const { isOnline } = useOnlineStatus();

  const { width } = useWindowSize();

  const user = useSelector(userSelectors.getUser);

  const isFirstVisit = useSelector(getIsMotherFirstVisitSelector);

  const completedVisits = useSelector((state: RootState) =>
    getMomCompletedVisitsByVisitIdSelector(state, visitId)
  )?.visits;

  useLayoutEffect(() => {
    if (!completedVisits) {
      appDispatch(
        visitThunkActions.getMomCompletedVisitsForVisitId({
          visitId,
        })
      );
    }
  }, [visitId, appDispatch, completedVisits]);

  const previousMotherVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );

  const activityListUpdated =
    previousMotherVisit?.visitDataStatus?.length! > 0
      ? activitiesList
      : activitiesList;

  const { visibleActivities } = useMemo(() => {
    const visibleActivities = activityListUpdated.filter((item) => {
      if (item.id === activitiesTypes.dangerSigns && isFirstVisit)
        return undefined;

      return item;
    });

    return { visibleActivities };
  }, [activityListUpdated, isFirstVisit]);

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const name = mother?.user?.firstName;

  const isLargeName =
    (name || '').length + (mother?.user?.surname || '').length > 22;

  const today = useMemo(() => new Date(), []);
  const options: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    []
  );

  const { completedForms, uncompletedForms, followUpForm, stepperCount } =
    useMemo(() => {
      const completedActivities = visibleActivities.filter((item) =>
        completedVisits?.includes(item.title)
      );
      const uncompletedActivities = visibleActivities.filter(
        (item) => !completedVisits?.includes(item.title)
      );

      const completedForms = completedActivities.map(
        (item): MenuListDataItem => ({
          showIcon: true,
          menuIconUrl: item?.menuIconUrl,
          menuIconClassName: 'w-7 h-7',
          title: item?.title,
          titleStyle: 'text-textDark',
          subTitle: '',
          iconBackgroundColor: 'successMain' as Colours,
          backgroundColor: 'successBg' as Colours,
          rightIcon: 'BadgeCheckIcon',
          rightIconClassName: 'h-5 w-5 text-successMain',
          onActionClick: () => {
            if (item.id) {
              window.sessionStorage.setItem(currentActivityKey, item.id);
              setShowForm(true);
            }
          },
        })
      );

      const uncompletedForms = uncompletedActivities.map(
        (item): MenuListDataItem => ({
          showIcon: true,
          menuIconUrl: item?.menuIconUrl,
          menuIconClassName: 'w-7 h-7',
          title: item?.title,
          subTitle: '',
          iconBackgroundColor: item.iconBackgroundColor as Colours,
          hexBackgroundColor: item.hexBackgroundColor || '',
          className: item.className,
          onActionClick: () => {
            if (item.id) {
              window.sessionStorage.setItem(currentActivityKey, item.id);
              setShowForm(true);
            }
          },
        })
      );

      const stepperCount = completedForms.length + uncompletedForms.length + 1; // +1 is for followup

      const followUpForm: MenuListDataItem[] = [
        {
          showIcon: true,
          menuIcon: 'CalendarIcon',
          menuIconClassName: 'border-0',
          iconColor: 'white',
          title: 'Follow up',
          titleStyle: 'text-textDark semibold',
          subTitle: 'Schedule your next visit, make referrals & save notes',
          subTitleStyle: 'text-textMid',
          iconBackgroundColor: 'tertiary' as Colours,
          backgroundColor: 'uiBg' as Colours,
          onActionClick: () => {
            window.sessionStorage.setItem(currentActivityKey, 'Follow up');
            setShowForm(true);
          },
        },
      ];

      return { uncompletedForms, completedForms, followUpForm, stepperCount };
    }, [visibleActivities, completedVisits]);

  const isFollowUp =
    completedForms.length >= visibleActivities.length &&
    !completedVisits?.some((item) => item.includes('Follow'));
  const isAllCompleted =
    !!currentVisit?.attended || completedVisits?.length === stepperCount;

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}`);
  }, [history, motherId]);

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    setShowForm(false);
    setIsStartVisit(true);
  };

  const onHelp = () => {
    setDisplayHelp(true);
  };

  useLayoutEffect(() => {
    if (selectedOption) {
      setShowForm(true);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (
      !previousSelectedOption?.includes('Follow') &&
      selectedOption?.includes('Follow')
    ) {
      appDispatch(
        motherThunkActions.getReferralsForMother({
          motherId: motherId,
          visitId: visitId,
        })
      ).unwrap();
    }
  }, [appDispatch, motherId, previousSelectedOption, selectedOption, visitId]);

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getPreviousVisitInformationForMother({
        visitId,
      })
    );
    appDispatch(
      visitThunkActions.GetMotherSummaryByPriority({
        visitId,
      })
    );
  }, [appDispatch, visitId]);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
          className="p-4"
        />
      );
    }

    if (
      isStartVisit ||
      !previousMotherVisit?.visitDataStatus?.length ||
      isAllCompleted
    ) {
      return (
        <div className="p-4">
          <Typography
            type="h2"
            align="left"
            weight="bold"
            text={'Your summary for this visit'}
            color="textDark"
            className="col-span-2"
          />
          <Typography
            type="body"
            align="left"
            weight="skinny"
            text={today.toLocaleDateString('en-ZA', options)}
            color="textMid"
          />
          {isAllCompleted ? (
            <>
              <PollyImpressed className="mt-11 h-28 w-full self-center" />
              <Typography
                type="h3"
                align="center"
                weight="bold"
                text={`Well done ${user?.firstName}`}
                color="textDark"
                className="w- mt-6 mb-2"
              />
              <Typography
                type="body"
                align="center"
                text={`You supported ${name} through their first thousand days by completing all activities. Thank you!`}
                color="textMid"
                className="mb-4"
              />
              <Button
                className="mt-20 w-full"
                color="primary"
                textColor="white"
                type="filled"
                text="Back to client profile"
                onClick={goBack}
              />
            </>
          ) : (
            <>
              <Typography
                type="h4"
                align="left"
                weight="bold"
                text="Tap a button below to get started."
                color="textDark"
                className="mt-6 mb-4"
              />
              {isFollowUp && (
                <StackedList
                  isFullHeight={false}
                  className={'mb-2 flex flex-col gap-2'}
                  listItems={followUpForm}
                  type={'MenuList'}
                />
              )}
              {!!uncompletedForms.length && (
                <>
                  <StackedList
                    isFullHeight={false}
                    className={'flex flex-col gap-2'}
                    listItems={uncompletedForms}
                    type={'MenuList'}
                  />
                </>
              )}
              <div className="mt-8 flex gap-1">
                {Array.from({ length: stepperCount }, (_, i) => (
                  <span
                    key={i}
                    className="rounded-10 h-2"
                    style={{
                      minWidth: 37,
                      background:
                        !!completedVisits?.length &&
                        i + 1 <= completedVisits?.length
                          ? '#26ACAF'
                          : '#D4EEEF',
                      width: width / stepperCount,
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {!!completedVisits?.length && (
            <Button
              className={`${isAllCompleted ? 'mt-4' : 'mt-8'} w-full`}
              type="outlined"
              color="primary"
              textColor="primary"
              icon={isShowCompletedForms ? 'EyeOffIcon' : 'EyeIcon'}
              text={
                isShowCompletedForms
                  ? 'Hide completed activities'
                  : 'See completed activities'
              }
              onClick={() => setIsShowCompletedForms((prevState) => !prevState)}
            />
          )}
          {isShowCompletedForms && (
            <StackedList
              isFullHeight={false}
              className={'mt-8 flex flex-col gap-2'}
              listItems={completedForms}
              type={'MenuList'}
            />
          )}
        </div>
      );
    }

    return (
      <IntroScreen mother={mother} onStartVisit={() => setIsStartVisit(true)} />
    );
  }, [
    isLoading,
    isStartVisit,
    previousMotherVisit?.visitDataStatus?.length,
    mother,
    today,
    options,
    isAllCompleted,
    user?.firstName,
    name,
    goBack,
    isFollowUp,
    followUpForm,
    uncompletedForms,
    completedVisits?.length,
    isShowCompletedForms,
    completedForms,
    width,
    stepperCount,
  ]);

  if (showForm && selectedOption) {
    return <Form onBack={onFormBack} />;
  }

  return (
    <>
      <BannerWrapper
        size="medium"
        renderBorder
        onBack={goBack}
        title={`${name || ''} ${
          !isLargeName ? mother?.user?.surname || '' : ''
        }`}
        subTitle="Pregnancy activities"
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp
        onHelp={onHelp}
      >
        {renderContent}
      </BannerWrapper>
      <Dialog
        fullScreen={true}
        visible={displayHelp}
        position={DialogPosition.Full}
      >
        <ActivityInfoPage
          section="Pregnancy activities"
          subTitle="Pregnancy activities"
          setDisplayHelp={setDisplayHelp}
        />
      </Dialog>
    </>
  );
};
