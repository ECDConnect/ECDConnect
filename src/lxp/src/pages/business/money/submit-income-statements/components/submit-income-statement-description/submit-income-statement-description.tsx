import ROUTES from '@/routes/routes';
import {
  Typography,
  Card,
  StackedList,
  Alert,
  BannerWrapper,
} from '@ecdlink/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import format from 'date-fns/format';

export const SubmitIncomeStatementsDescription: React.FC = () => {
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const { isOnline } = useOnlineStatus();

  const goBack = () => {
    history.push(ROUTES.BUSINESS);
  };

  const incomeItems = [
    {
      title: `Themba Sibiya`,
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
      title: `Amahle Khumalo`,
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
          text={'Preschool fees'}
        />
        <Typography
          className="truncate"
          type="body"
          color="textDark"
          text={'December income'}
        />

        <Alert
          type={'info'}
          message={
            'If you’ve made a mistake in any of the items below, you can edit them now by tapping the relevant item.'
          }
          className="mt-6"
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
            className="w-8/12"
          />
          <Typography
            text={'R 1 800.11'}
            color={'white'}
            type="h4"
            className="mr-10 w-4/12 text-right"
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
