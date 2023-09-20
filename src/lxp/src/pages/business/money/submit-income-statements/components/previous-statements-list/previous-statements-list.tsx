import ROUTES from '@/routes/routes';
import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
} from '@ecdlink/ui';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { LocalStorageKeys } from '@ecdlink/core';

export const PreviousStatementsList: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );

  const goBack = () => {
    history.push(ROUTES.BUSINESS);
  };

  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const currentMontBalanceSheet = balanceSheet?.[balanceSheet?.length - 1];

  const yearBalance = balanceSheet?.reduce(function (prev: any, current: any) {
    return prev + +current?.balance;
  }, 0);

  const prevStatementsItems = balanceSheet?.map((item) => {
    return {
      title: `${getMonthName(Number(item?.month) - 1)} ${item?.year}`,
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () =>
        history.push(ROUTES.BUSINESS_MONTH_STATEMENTS_DETAILS, {
          month: item?.month,
          year: item?.year,
        }),
      classNames: 'bg-uiBg',
      notRounded: true,
    };
  });

  const offlinePrevStatementsItems = [
    {
      title: `${getMonthName(Number(currentMontBalanceSheet?.month) - 1)} ${
        currentMontBalanceSheet?.year
      }`,
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () =>
        history.push(ROUTES.BUSINESS_MONTH_STATEMENTS_DETAILS, {
          month: currentMontBalanceSheet?.month,
          year: currentMontBalanceSheet?.year,
        }),
      classNames: 'bg-uiBg',
      notRounded: true,
    },
  ];

  const displayTotalBalance = useMemo(() => {
    if (yearBalance > 0) {
      return (
        <Card
          className="bg-successMain mt-2 flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Profit'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${String(numberWithSpaces(yearBalance.toFixed(2)))}`}
            color={'white'}
            type="h4"
            className="mr-4 w-5/12 text-right"
          />
        </Card>
      );
    } else {
      return (
        <Card
          className="bg-tertiary mt-2 flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Loss'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${String(numberWithSpaces(yearBalance.toFixed(2)))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
      );
    }
  }, [yearBalance]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'View & download previous statements'}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <div className="flex flex-col justify-center p-4">
        <Typography
          type="h2"
          weight="bold"
          color="textDark"
          text={'Choose a statement to view and download'}
        />
        {prevStatementsItems && (
          <StackedList
            className="mt-4 flex w-full flex-col gap-1"
            type="MenuList"
            listItems={
              isOnline ? prevStatementsItems : offlinePrevStatementsItems
            }
          />
        )}
        {isOnline && displayTotalBalance}
        {isOnline ? (
          <Button
            shape="normal"
            color="primary"
            type="filled"
            icon="DocumentSearchIcon"
            onClick={() => {}}
            className="mt-6 rounded-2xl"
          >
            <Typography type="help" color="white" text="See more statements" />
          </Button>
        ) : (
          <img src={offlineImg!} alt="" />
        )}
      </div>
    </BannerWrapper>
  );
};
