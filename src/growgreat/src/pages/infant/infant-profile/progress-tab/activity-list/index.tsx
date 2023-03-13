import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Colours,
  MenuListDataItem,
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
import { useAppDispatch } from '@/store';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const currentActivityKey = 'selectedOption';

export const ActivityList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const selectedOption = window.sessionStorage.getItem(currentActivityKey);

  const { isOnline } = useOnlineStatus();

  const { width } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const appDispatch = useAppDispatch();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const isLargeName =
    (infant?.user?.firstName || '').length +
      (infant?.user?.surname || '').length >
    22;

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedData = useMemo(
    () =>
      activitiesList.map(
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
      ),
    []
  );

  const goBack = useCallback(
    () => history.push(ROUTES.CLIENTS.ROOT),
    [history]
  );

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
  }, [appDispatch, infantId]);

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
      className="p-4"
    >
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
      <StackedList
        isFullHeight={false}
        className={'flex flex-col gap-2'}
        listItems={formattedData}
        type={'MenuList'}
      />
      <div className="mt-8 flex gap-1">
        {Object.values(activitiesTypes).map((item) => (
          <span
            key={item}
            className="bg-secondaryAccent2  rounded-10 h-2"
            style={{
              minWidth: 37,
              width: width / Object.values(activitiesTypes).length,
            }}
          />
        ))}
      </div>
    </BannerWrapper>
  );
};
