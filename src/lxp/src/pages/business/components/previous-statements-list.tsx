import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
} from '@ecdlink/ui';
import React, { useEffect, useMemo } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  formatCurrency,
  sumIncomeOrExpenseItems,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import {
  ExpenseItemDto,
  IncomeItemDto,
  IncomeStatementDto,
  getNextMonth,
  getPreviousMonth,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';

export type PreviousStatementsListProps = {
  statements: IncomeStatementDto[];
  unsubmittedIncome: IncomeItemDto[];
  unsubmittedExpenses: ExpenseItemDto[];
  onBack: () => void;
  onActionClick: (statementId: string | undefined) => void;
};

export const PreviousStatementsList: React.FC<PreviousStatementsListProps> = ({
  statements,
  unsubmittedIncome,
  unsubmittedExpenses,
  onBack,
  onActionClick,
}) => {
  const { isOnline } = useOnlineStatus();

  const submittedBalance = statements.reduce(function (total: number, current) {
    return total + current.balance;
  }, 0);

  const yearBalance =
    submittedBalance +
    sumIncomeOrExpenseItems(unsubmittedIncome) -
    sumIncomeOrExpenseItems(unsubmittedExpenses);

  const currentDate = new Date();

  const isThisMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth() + 1),
    [statements]
  );
  const isPreviousMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth()),
    [statements]
  );

  // submit window open And last statement not submitted -> previous month
  // submitted this month -> next month
  // otherwise current month
  const summaryDate = isThisMonthSubmitted
    ? getNextMonth(currentDate)
    : !isPreviousMonthSubmitted &&
      currentDate.getDate() <= IncomeStatementDates.SubmitEndDay
    ? getPreviousMonth(currentDate)
    : currentDate;

  const prevStatementsItems = useMemo(() => {
    return [
      ...statements.map((item) => {
        return {
          title: `${getMonthName(item.month - 1)} ${item.year}`,
          titleStyle: 'text-textDark font-semibold text-base leading-snug',
          subTitleStyle:
            'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
          text: '1',
          onActionClick: () => onActionClick(item.id),
          classNames: 'bg-uiBg',
          notRounded: true,
        };
      }),
      {
        title: `${getMonthName(
          summaryDate.getMonth()
        )} ${summaryDate.getFullYear()}`,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        text: '1',
        onActionClick: () => onActionClick(undefined),
        classNames: 'bg-uiBg',
        notRounded: true,
      },
    ];
  }, [statements, onActionClick, unsubmittedIncome, unsubmittedExpenses]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'View & download previous statements'}
      color={'primary'}
      onBack={onBack}
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
            listItems={prevStatementsItems}
          />
        )}
        <Card
          className={`bg-${
            yearBalance > 0 ? 'successMain' : 'tertiary'
          } mt-2 flex items-center justify-between p-4`}
          shadowSize={'md'}
        >
          <Typography
            text={yearBalance > 0 ? 'Profit' : 'Loss'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${formatCurrency(yearBalance)}`}
            color={'white'}
            type="h4"
            className="mr-4 w-5/12 text-right"
          />
        </Card>
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
      </div>
    </BannerWrapper>
  );
};
