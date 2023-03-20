import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Colours,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import {
  getInfantById,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { activitiesList, activitiesTypes } from './activities-list';
import { Form } from './forms';
import { useWindowSize } from '@reach/window-size';
import { infantThunkActions } from '@/store/infant';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import {
  getCompletedVisitsByVisitIdSelector,
  getPreviousVisitInformationForInfantSelector,
} from '@/store/visit/visit.selectors';
import { IntroScreen } from './intro-screen';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const currentActivityKey = 'selectedOption';

export const ActivityList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isShowCompletedForms, setIsShowCompletedForms] = useState(false);
  const [isStartVisit, setIsStartVisit] = useState(false);

  const selectedOption = window.sessionStorage.getItem(currentActivityKey);

  const { isOnline } = useOnlineStatus();

  const { width } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const visits = useSelector(getInfantVisitsSelector);
  const MOCKED_VISIT_ID = visits[0]?.id;

  const completedVisits = useSelector((state: RootState) =>
    getCompletedVisitsByVisitIdSelector(state, MOCKED_VISIT_ID)
  )?.visits;

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
  const isFollowUp = completedVisits?.length === 7;

  const [, , , infantId] = location.pathname.split('/');

  const appDispatch = useAppDispatch();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const isLargeName =
    (infant?.user?.firstName || '').length +
      (infant?.user?.surname || '').length >
    22;

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
    const completedActivities = activitiesList.filter((item) =>
      completedVisits?.includes(item.title)
    );
    const uncompletedActivities = activitiesList.filter(
      (item) => !completedVisits?.includes(item.title)
    );

    const completedForms = completedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
        title: item?.title,
        subTitle: '',
        iconBackgroundColor: 'successMain' as Colours,
        backgroundColor: 'successBg' as Colours,
        rightIcon: 'BadgeCheckIcon',
        rightIconClassName: 'h-5 w-5 text-successMain',
      })
    );

    const uncompletedForms = uncompletedActivities.map(
      (item): MenuListDataItem => ({
        showIcon: true,
        menuIconUrl: item?.menuIconUrl,
        menuIconClassName: 'border-0',
        title: item?.title,
        subTitle: '',
        iconBackgroundColor: item.iconBackgroundColor as Colours,
        iconHexBackgroundColor: item.iconHexBackgroundColor,
        backgroundColor: (item.backgroundColor as Colours) || '',
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
    setShowForm(false);
    window.sessionStorage.removeItem(currentActivityKey);
  };

  useLayoutEffect(() => {
    if (selectedOption) {
      setShowForm(true);
    }
  }, [selectedOption]);

  useLayoutEffect(() => {
    appDispatch(infantThunkActions.getInfantVisits({ infantId })).unwrap();
    // appDispatch(visitThunkActions.getGrowthDataForInfant({ infantId })).unwrap()
  }, [appDispatch, infantId]);

  useLayoutEffect(() => {
    // TODO: add integration
    appDispatch(
      visitThunkActions.getCompletedVisitsForVisitId({
        visitId: MOCKED_VISIT_ID,
      })
    );
  }, [MOCKED_VISIT_ID, appDispatch]);

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getPreviousVisitInformationForInfant({
        visitId: MOCKED_VISIT_ID,
      })
    );
  }, [MOCKED_VISIT_ID, appDispatch]);

  const renderContent = useMemo(() => {
    if (isStartVisit || !previousVisit?.visitDataStatus?.length) {
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
          <Typography
            type="h4"
            align="left"
            weight="bold"
            text="Tap a button below to get started."
            color="textDark"
            className="mt-6 mb-4"
          />
          {isFollowUp ? (
            <StackedList
              isFullHeight={false}
              className={'flex flex-col gap-2'}
              listItems={followUpForm}
              type={'MenuList'}
            />
          ) : (
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
          {!!completedVisits?.length && (
            <Button
              className="mt-8 w-full"
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
      <IntroScreen infant={infant} onStartVisit={() => setIsStartVisit(true)} />
    );
  }, [
    completedForms,
    completedVisits?.length,
    followUpForm,
    infant,
    isFollowUp,
    isShowCompletedForms,
    isStartVisit,
    options,
    previousVisit?.visitDataStatus?.length,
    today,
    uncompletedForms,
    width,
  ]);

  if (showForm && selectedOption) {
    return <Form onBack={onFormBack} />;
  }

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${infant?.user?.firstName || ''} ${
        !isLargeName ? infant?.user?.surname || '' : ''
      }`}
      subTitle="Child visit activities"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      {renderContent}
    </BannerWrapper>
  );
};
