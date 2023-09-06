import ROUTES from '@/routes/routes';
import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
} from '@ecdlink/ui';
import React, { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { LocalStorageKeys } from '@ecdlink/core';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';

export const PractitionerPreviousStatementsList: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );
  const { practitionerId } = useParams<PractitionerBusinessParams>();

  const goBack = () => {
    history.push(
      ROUTES.COACH.PRACTITIONER_BUSINESS.BUSINESS.replace(
        ':practitionerId',
        practitionerId
      )
    );
  };

  const balanceSheet = useSelector(
    practitionerSelectors.getPractitionerBalanceSheet
  );
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
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.STATEMENT_DETAILS.replace(
            ':practitionerId',
            practitionerId
          ),
          {
            month: item?.month,
            year: item?.year,
          }
        ),
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
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.STATEMENT_DETAILS.replace(
            ':practitionerId',
            practitionerId
          ),
          {
            month: currentMontBalanceSheet?.month,
            year: currentMontBalanceSheet?.year,
          }
        ),
      classNames: 'bg-uiBg',
      notRounded: true,
    },
  ];

  const displayTotalBalance = useMemo(() => {
    if (yearBalance > 0) {
      return (
        <Card
          className="bg-successMain mt-3 flex items-center justify-between p-4"
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
          className="bg-tertiary mt-3 flex items-center justify-between p-4"
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
          className="mb-4"
          weight="bold"
          color="textDark"
          text={'Choose a statement to view and download'}
        />
        {prevStatementsItems && (
          <StackedList
            className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
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
