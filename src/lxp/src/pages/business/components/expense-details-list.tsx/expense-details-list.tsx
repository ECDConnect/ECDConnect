import {
  Typography,
  Card,
  StackedList,
  BannerWrapper,
  Button,
} from '@ecdlink/ui';
import React from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  formatCurrency,
  numberWithSpaces,
  sumIncomeOrExpenseItems,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { format } from 'date-fns';
import { ExpenseDetailsListProps } from './expense-details-list.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

export const ExpenseDetailsList: React.FC<ExpenseDetailsListProps> = ({
  hideDetails,
  statementTitle,
  expenseItems,
  statementMonth,
  statementId,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const expenseListDetailsItems = expenseItems?.map((item) => {
    return {
      title:
        item.notes ?? format(Date.parse(item.datePaid || ''), 'dd/MM/yyyy'),
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {
        history.push(ROUTES.BUSINESS_UPDATE_EXPENSE, {
          statementId: statementId,
          expenseItem: item,
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
          text={`${getMonthName(Number(statementMonth))} expenses`}
        />
        {expenseListDetailsItems && (
          <StackedList
            className="mt-4 flex w-full flex-col"
            type="MenuList"
            listItems={expenseListDetailsItems}
          />
        )}
        <Card
          className="bg-secondary flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total income'}
            type="body"
            color={'white'}
            className="w-8/12"
          />
          <Typography
            text={`R ${formatCurrency(sumIncomeOrExpenseItems(expenseItems))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
