import {
  Typography,
  Card,
  StackedList,
  BannerWrapper,
  Button,
} from '@ecdlink/ui';
import React from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import {
  getChildName,
  sumIncomeOrExpenseItems,
  numberWithSpaces,
  formatCurrency,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { childrenSelectors } from '@/store/children';
import { IncomeDetailsListProps } from './income-details-list.types';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';

export const IncomeDetailsList: React.FC<IncomeDetailsListProps> = ({
  hideDetails,
  statementTitle,
  incomeItems,
  statementMonth,
  statementId,
}) => {
  const history = useHistory();
  const children = useSelector(childrenSelectors.getChildren);
  const { isOnline } = useOnlineStatus();

  const incomeListDetailsItems = incomeItems?.map((item) => {
    return {
      title: item?.childUserId
        ? getChildName(item?.childUserId!, children!) || 'Child not found' // Child may have been removed so we won't have the name
        : format(Date.parse(item.dateReceived || ''), 'dd/MM/yyyy'),
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {
        history.push(ROUTES.BUSINESS_UPDATE_INCOME, {
          statementId: statementId,
          incomeItem: item,
        });
      },
      classNames: 'bg-uiBg',
      subItem: `R ${numberWithSpaces(String(item?.amount!.toFixed(2)))}`,
      notRounded: true,
      childList: true,
    };
  });

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`View ${getMonthName(Number(statementMonth))} preschool statement`}
      color={'primary'}
      onBack={hideDetails}
      displayOffline={!isOnline}
    >
      <div className="flex flex-col justify-center p-4">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textDark"
          text={statementTitle}
        />
        <Typography
          className="truncate"
          type="body"
          weight="bold"
          color="textMid"
          text={`${getMonthName(Number(statementMonth))} income`}
        />
        {incomeListDetailsItems && (
          <StackedList
            className="mt-4 flex w-full flex-col"
            type="MenuList"
            listItems={incomeListDetailsItems}
          />
        )}
        <Card
          className="bg-tertiary flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total income'}
            type="body"
            color={'white'}
            className="w-8/12"
          />
          <Typography
            text={`R ${formatCurrency(sumIncomeOrExpenseItems(incomeItems))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
