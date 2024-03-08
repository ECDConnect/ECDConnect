import {
  Button,
  DialogPosition,
  Divider,
  LoadingSpinner,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { NoCommunityFound } from '../0-components/no-community-found';
import { getCommunityQuarterDescription } from '@/utils/community/community-quarters.utils';
import { useWindowSize } from '@reach/window-size';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { CommunityRouteState } from '../community.types';
import { COMMUNITY_TABS } from '../community';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAlertSeverity } from '@/utils/common/string.utils';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  MonthData,
  createCurrentMonthBlankData,
  getPointsDetails,
  groupBreastfeedingClubByMonth,
} from '@/utils/community/breastfeeding-clubs.utils';
import { CommunityActions } from '@/store/community/community.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { MonthDetails } from './month-details';

export const BreastfeedingClubsTab: React.FC = () => {
  const [isToShowAll, setIsToShowAll] = useState(false);

  const clinic = useAppSelector(communitySelectors.getClinicSelector);
  const breastfeedingClubs = useAppSelector(
    communitySelectors.getBreastFeedingClubsSelector
  );

  const { showMessage } = useSnackbar();

  const {
    isLoading: isLoadingBreastFeedingClubs,
    wasLoading: wasLoadingBreastFeedingClubs,
    isRejected: isRejectedBreastFeedingClubs,
    error: errorBreastFeedingClubs,
  } = useThunkFetchCall('community', CommunityActions.GET_BREAST_FEEDING_CLUBS);
  const {
    isLoading: isLoadingClinic,
    wasLoading: wasLoadingClinic,
    isRejected: isRejectedClinic,
    error: errorClinic,
  } = useThunkFetchCall('community', CommunityActions.GET_CLINIC_BY_ID);

  const isLoading = isLoadingBreastFeedingClubs || (!clinic && isLoadingClinic);
  const wasLoading = wasLoadingBreastFeedingClubs || wasLoadingClinic;
  const isRejected = isRejectedBreastFeedingClubs || isRejectedClinic;
  const error = errorBreastFeedingClubs || errorClinic;

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({
        message: error,
        type: 'error',
      });
    }
  }, [error, isLoading, isRejected, showMessage, wasLoading]);

  const { height } = useWindowSize();

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const headerHeight = 120;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const { quarter } = getCommunityQuarterDescription(today);

  const endMonth = new Date(currentYear, quarter.endMonth, 1);

  const title = `Oct ${currentYear - 1} to ${format(
    endMonth,
    'MMM'
  )} ${currentYear}`;

  const monthData = groupBreastfeedingClubByMonth(breastfeedingClubs ?? []);

  const isToAddCurrentMonthData = !monthData?.some((item) => {
    return item.month === currentMonth && item.year === currentYear;
  });

  const mergedBreastfeedingClubs = useMemo(() => {
    if (isToAddCurrentMonthData) {
      return [createCurrentMonthBlankData(), ...monthData];
    }

    return monthData;
  }, [monthData, isToAddCurrentMonthData]);

  const filteredBreastfeedingClubs = isToShowAll
    ? mergedBreastfeedingClubs
    : mergedBreastfeedingClubs?.slice(0, 5);

  const onMonthClick = useCallback(
    (monthData: MonthData) => {
      dialog({
        blocking: true,
        position: DialogPosition.Full,
        color: 'bg-white',
        render(onClose) {
          return <MonthDetails onBack={onClose} monthData={monthData} />;
        },
      });
    },
    [dialog]
  );

  const pastBreastfeedingClubs: UserAlertListDataItem[] = useMemo(
    () =>
      filteredBreastfeedingClubs?.map((item) => {
        const date = new Date(item.year, item.month, 1);

        const month = format(date, 'MMMM');

        const { points, colour } = getPointsDetails(item.data);

        return {
          title: month,
          subItem: `+ ${points}`,
          subTitle: `${item.data.length} breastfeeding clubs`,
          alertSeverity: getAlertSeverity(colour),
          titleStyle: 'text-textDark',
          avatarColor: '',
          hideAvatar: true,
          onActionClick: () => onMonthClick(item),
        } as UserAlertListDataItem;
      }) ?? [],
    [filteredBreastfeedingClubs, onMonthClick]
  );

  useEffect(() => {
    if (!!clinic?.id) {
      appDispatch(
        communityThunkActions.getBreastFeedingClubs({
          clinicId: clinic.id,
        })
      );
    }
    // trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  if (!clinic) {
    return <NoCommunityFound />;
  }

  return (
    <div
      className="overflow-auto p-4 pt-6"
      style={{ height: height - headerHeight }}
    >
      <div className="flex h-full flex-col">
        <Typography type="h2" text={title} />
        <Typography
          type="h3"
          color="textDark"
          text="Past breastfeeding clubs:"
          className="mt-7 mb-5"
        />
        <div>
          <StackedList
            isFullHeight={false}
            className="flex flex-col gap-2"
            type={'UserAlertList' as StackedListType}
            listItems={pastBreastfeedingClubs}
          />
        </div>
        {mergedBreastfeedingClubs.length > 5 && (
          <Button
            className="my-4"
            type="outlined"
            textColor="primary"
            color="primary"
            text={isToShowAll ? 'See less months' : 'See more months'}
            onClick={() => setIsToShowAll(!isToShowAll)}
          />
        )}
        <div className={`mt-auto flex flex-col gap-4`}>
          <Divider dividerType="dashed" className="mb-2" />
          <Button
            icon="PlusCircleIcon"
            type="filled"
            textColor="white"
            color="primary"
            text="Add a breastfeeding club"
            // TODO: Add onClick
            onClick={() => {}}
          />
          <Button
            className="mb-4"
            icon="ArrowCircleLeftIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="Back to team"
            onClick={() =>
              history.push(ROUTES.COMMUNITY.ROOT, {
                activeTabIndex: COMMUNITY_TABS.TEAM,
              } as CommunityRouteState)
            }
          />
        </div>
      </div>
    </div>
  );
};
