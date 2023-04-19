import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
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

import { getInfantById } from '@/store/infant/infant.selectors';
import { activitiesList, activitiesTypes } from './activities-list';
import { Form } from './forms';
import { useWindowSize } from '@reach/window-size';
import { infantThunkActions } from '@/store/infant';
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
// import { relationshipTypes } from '../../../../infant/components/mother-details/mother-details.types';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { userSelectors } from '@/store/user';
import { ActivityInfoPage } from './activity-info-page';
import { motherThunkActions } from '@/store/mother';
import { getMotherById } from '@/store/mother/mother.selectors';

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

  const { isOnline } = useOnlineStatus();

  const { width } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const user = useSelector(userSelectors.getUser);

  // const visits2 = useSelector(getMotherVisits);

  const MOCKED_VISIT_ID = visitId;

  const completedVisits = useSelector((state: RootState) =>
    getMomCompletedVisitsByVisitIdSelector(state, MOCKED_VISIT_ID)
  )?.visits;

  const previousMotherVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );

  //TODO when BE is fixed
  // const activityListFiltered = activitiesList?.filter(
  //   (item) => item?.title !== 'Danger signs'
  // );

  //TODO when BE is fixed
  // const activityListUpdated =
  //   previousMotherVisit?.visitDataStatus?.length! > 0
  //     ? activitiesList
  //     : activityListFiltered;

  const isFollowUp = completedVisits?.length === 4;
  const isAllCompleted = completedVisits?.length === 5;

  const [, , , infantId] = location.pathname.split('/');
  const [, , , motherId] = location.pathname.split('/');

  const appDispatch = useAppDispatch();

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const name = mother?.user?.firstName;

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT
  );

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

  const { completedForms, uncompletedForms, followUpForm } = useMemo(() => {
    // const motherType = relationshipTypes.find(
    //   (item) => item.label === 'Mother'
    // );

    const completedActivities = activitiesList.filter((item) =>
      completedVisits?.includes(item.title)
    );
    const uncompletedActivities = activitiesList.filter(
      (item) => !completedVisits?.includes(item.title)
    );

    console.log({ completedActivities });

    const completedForms = completedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
        title: item?.title,
        titleStyle: 'text-textDark',
        subTitle: '',
        iconBackgroundColor: 'successMain' as Colours,
        backgroundColor: 'successBg' as Colours,
        rightIcon: 'BadgeCheckIcon',
        rightIconClassName: 'h-5 w-5 text-successMain',
      })
    );

    console.log({ completedForms });

    const uncompletedForms = uncompletedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
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

    const followUpForm: MenuListDataItem[] = [
      {
        showIcon: true,
        menuIcon: 'CalendarIcon',
        menuIconClassName: 'border-0',
        iconColor: 'white',
        title: 'Follow up',
        subTitle: 'Schedule your next visit, make referrals & save notes',
        iconBackgroundColor: 'tertiary' as Colours,
        backgroundColor: 'uiBg' as Colours,
        onActionClick: () => {
          window.sessionStorage.setItem(currentActivityKey, 'Follow up');
          setShowForm(true);
        },
      },
    ];

    return { uncompletedForms, completedForms, followUpForm };
  }, [completedVisits]);

  const goBack = useCallback(() => {
    if (isStartVisit) {
      return setIsStartVisit(false);
    }
    return history.push(ROUTES.CLIENTS.ROOT);
  }, [history, isStartVisit]);

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    setShowForm(false);
  };

  const onHelp = () => {
    setDisplayHelp(true);
  };

  useLayoutEffect(() => {
    if (selectedOption) {
      setShowForm(true);
    }
  }, [selectedOption]);

  useLayoutEffect(() => {
    appDispatch(infantThunkActions.getInfantVisits({ infantId })).unwrap();

    appDispatch(motherThunkActions?.getMotherVisits({ motherId }));
    appDispatch(
      visitThunkActions.getGrowthDataForInfant({ infantId })
    ).unwrap();
    appDispatch(
      referralThunkActions.getReferralsForInfant({ infantId })
    ).unwrap();
  }, [appDispatch, infantId, motherId]);

  useLayoutEffect(() => {
    // TODO: add integration
    appDispatch(
      visitThunkActions.getMomCompletedVisitsForVisitId({
        visitId: MOCKED_VISIT_ID,
      })
    );
    appDispatch(
      visitThunkActions.getPreviousVisitInformationForMother({
        visitId: MOCKED_VISIT_ID,
      })
    );
  }, [MOCKED_VISIT_ID, appDispatch]);

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getVisitAnswersForMother({
        visitId: MOCKED_VISIT_ID,
        visitName: activitiesTypes.nutrition,
        visitSection: DevelopmentalScreeningVisitSection,
      })
    );
  }, [MOCKED_VISIT_ID, appDispatch]);

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

    if (isStartVisit || !previousMotherVisit?.visitDataStatus?.length) {
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
              <div className="flex items-center justify-center gap-2">
                {renderIcon('GiftIcon', 'text-primary w-4 h-4')}
                <Typography
                  type="body"
                  align="center"
                  text={`You earned X points!`}
                  color="textDark"
                />
              </div>
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
                  className={'flex flex-col gap-2'}
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
                {Object.values(activitiesTypes).map((item, index) => (
                  <span
                    key={item}
                    className="rounded-10 h-2"
                    style={{
                      minWidth: 37,
                      background:
                        !!completedVisits?.length &&
                        index + 1 <= completedVisits?.length
                          ? '#26ACAF'
                          : '#D4EEEF',
                      width: width / Object.values(activitiesTypes).length,
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
        fullScreen={false}
        visible={displayHelp}
        position={DialogPosition.Full}
      >
        <ActivityInfoPage
          section="Activity Info"
          subTitle="Road to health activities"
          setDisplayHelp={setDisplayHelp}
        />
      </Dialog>
    </>
  );
};
