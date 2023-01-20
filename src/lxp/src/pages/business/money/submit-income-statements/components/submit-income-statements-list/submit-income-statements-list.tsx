import ROUTES from '@/routes/routes';
import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
  DialogPosition,
  Dialog,
  ActionModal,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const SubmitIncomeStatementsList: React.FC = () => {
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const { isOnline } = useOnlineStatus();
  const [confimSubmitIncomeValues, setConfimSubmitIncomeValues] =
    useState(false);

  const goBack = () => {
    history.push(ROUTES.BUSINESS);
  };

  const incomeItems = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 202.10',
      notRounded: true,
    },
    {
      title: 'Start-up support',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 202.10',
      notRounded: true,
    },
    {
      title: 'Donations or v..',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 202.10',
      notRounded: true,
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 202.10',
      notRounded: true,
    },
  ];

  const expensesItems = [
    {
      title: 'Rent',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () =>
        history.push(ROUTES.BUSINESS_SUBMIT_INCOME_STATEMENTS_DESCRIPTION),
      classNames: 'bg-uiBg',
      subItem: 'R 800.00',
      notRounded: true,
    },
    {
      title: 'Salary & wages',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 400.00',
      notRounded: true,
    },
    {
      title: 'Electricity, wat...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 100.12',
      notRounded: true,
    },
    {
      title: 'Learning mater...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 200.45',
      notRounded: true,
    },
    {
      title: 'Cleaning mater...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 100.55',
      notRounded: true,
    },
    {
      title: 'Food',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: 'R 200.60',
      notRounded: true,
    },
  ];

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Submit income statement'}
      subTitle={date}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <div className="flex flex-col justify-center p-4">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textDark"
          text={'December 2021'}
        />
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={incomeItems}
        />
        <Card
          className="bg-secondary flex items-center justify-around p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total income'}
            type="body"
            color={'white'}
            className="w-6/12"
          />
          <Typography
            text={'R 1 800.11'}
            color={'white'}
            type="h4"
            className="w-8/12 text-center"
          />
        </Card>
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={expensesItems}
        />
        <Card
          className="bg-secondary flex items-center justify-around p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total expenses'}
            type="body"
            color={'white'}
            className="w-6/12"
          />
          <Typography
            text={'R 1 700.20'}
            color={'white'}
            type="h4"
            className="w-8/12 text-center"
          />
        </Card>
        <Card
          className="bg-primaryAccent1 mt-4 flex items-center justify-around p-4"
          borderRaduis={'xl'}
          shadowSize={'md'}
        >
          <Typography
            text={'Balance'}
            type="h4"
            color={'white'}
            className="w-6/12"
          />
          <Typography
            text={'+ R 100.25'}
            color={'white'}
            type="h1"
            className="w-8/12 text-right"
          />
        </Card>
        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="ArrowCircleRightIcon"
          onClick={() => setConfimSubmitIncomeValues(true)}
          className="mt-6 rounded-2xl"
        >
          <Typography
            type="help"
            color="white"
            text="Submit income statement"
          />
        </Button>
      </div>
      <Dialog
        className={'mb-16 px-4'}
        stretch
        visible={confimSubmitIncomeValues}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to submit your income statement?`}
          detailText={
            'Once you submit your December income statement, you will no longer be able to edit your income and expenses. Your signature will be added and your statement will be shared with SmartStart.'
          }
          actionButtons={[
            {
              text: 'Yes, submit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {},
              leadingIcon: 'ArrowCircleRightIcon',
            },
            {
              text: 'No, exit',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                setConfimSubmitIncomeValues(false);
              },
              leadingIcon: 'ArrowLeftIcon',
            },
          ]}
        />
      </Dialog>
    </BannerWrapper>
  );
};
