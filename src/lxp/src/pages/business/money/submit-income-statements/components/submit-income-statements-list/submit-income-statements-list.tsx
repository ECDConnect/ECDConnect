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
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import {
  statementsSelectors,
  statementsThunkActions,
} from '@/store/statements';
import { authSelectors } from '@/store/auth';
import {
  sumIncomeOrExpenseItems,
  formatCurrency,
} from '@/utils/statements/statements-utils';
import { useAppDispatch } from '@/store';
import {
  ExpenseTypeIds,
  IncomeTypeIds,
  getPreviousMonth,
  useSnackbar,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';
import { pointsThunkActions } from '@/store/points';
import { BusinessTabItems } from '@/pages/business/business.types';

export const SubmitIncomeStatementsList: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();

  const userAuth = useSelector(authSelectors.getAuthUser);

  // const income = useSelector(statementsSelectors.getUnsubmittedIncomeItems);
  // const expenses = useSelector(statementsSelectors.getUnsubmittedExpenseItems);

  const currentDate = new Date();
  const date = format(currentDate, 'EEEE, d LLLL');
  const [confimSubmitIncomeValues, setConfimSubmitIncomeValues] =
    useState(false);

  const submitMonth =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay
      ? currentDate
      : getPreviousMonth(currentDate);

  // Totals
  // const totalIncome = sumIncomeOrExpenseItems(income);
  // const totalExpenses = sumIncomeOrExpenseItems(expenses);
  // const totalBalance = totalIncome - totalExpenses;

  // // Income values
  // const preschoolFees = useMemo(
  //   () =>
  //     income.filter((x) => x.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID),
  //   [income]
  // );
  // const startupSupport = useMemo(
  //   () =>
  //     income.filter((x) => x.incomeTypeId === IncomeTypeIds.STARTUP_SUPPORT_ID),
  //   [income]
  // );
  // const donationsOrVouchers = useMemo(
  //   () => income.filter((x) => x.incomeTypeId === IncomeTypeIds.DONATION_ID),
  //   [income]
  // );
  // const dbeSubsidy = useMemo(
  //   () => income.filter((x) => x.incomeTypeId === IncomeTypeIds.DBE_SUBSIDY_ID),
  //   [income]
  // );
  // const otherIncomeValues = useMemo(
  //   () =>
  //     income.filter((x) => x.incomeTypeId === IncomeTypeIds.OTHER_INCOME_ID),
  //   [income]
  // );

  // Expense Values
  // const rent = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.RENT_EXPENSE_ID
  //     ),
  //   [expenses]
  // );
  // const food = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.FOOD_EXPENSE_ID
  //     ),
  //   [expenses]
  // );
  // const learningMaterials = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.LEARNING_MATERIALS_ID
  //     ),
  //   [expenses]
  // );
  // const maintenance = useMemo(
  //   () =>
  //     expenses.filter((x) => x.expenseTypeId === ExpenseTypeIds.MAINTENANCE_ID),
  //   [expenses]
  // );
  // const otherExpenseValues = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.OTHER_EXPENSE_ID
  //     ),
  //   [expenses]
  // );
  // const utilities = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.UTILITIES_EXPENSE_ID
  //     ),
  //   [expenses]
  // );
  // const salary = useMemo(
  //   () =>
  //     expenses.filter(
  //       (x) => x.expenseTypeId === ExpenseTypeIds.SALARY_EXPENSE_ID
  //     ),
  //   [expenses]
  // );

  // const submitStatement = async () => {
  //   if (userAuth?.auth_token) {
  //     appDispatch(
  //       statementsThunkActions.submitIncomeStatement({
  //         userId: userAuth?.id!,
  //         month: submitMonth.getMonth() + 1, // +1 for 0 index
  //         year: submitMonth.getFullYear(),
  //         incomeItemIds: income.map((x) => x.id),
  //         expenseItemIds: expenses.map((x) => x.id),
  //       })
  //     ).then((result) => {
  //       if (result.meta.requestStatus === 'rejected') {
  //         showMessage({
  //           message: `Error submitting statement`,
  //           type: 'error',
  //         });
  //       } else {
  //         showMessage({
  //           message: `Statement submitted`,
  //           type: 'success',
  //         });

  //         // Refresh points - so we can show the celebration message
  //         const oneYearAgo = new Date();
  //         oneYearAgo.setMonth(currentDate.getMonth() - 12);
  //         appDispatch(
  //           pointsThunkActions.getPointsSummaryForUser({
  //             userId: userAuth?.id!,
  //             startDate: oneYearAgo,
  //             endDate: currentDate,
  //           })
  //         );
  //       }
  //     });
  //   }
  // };

  const incomeItems = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
      notRounded: true,
    },
    {
      title: 'DBE Subsidy',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
      notRounded: true,
    },
    {
      title: 'Annual Mainten...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
      notRounded: true,
    },
    {
      title: 'Utilities',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems([]))}`,
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
      onBack={() =>
        history.push(ROUTES.BUSINESS, {
          activeTabIndex: BusinessTabItems.MONEY,
        })
      }
      displayOffline={!isOnline}
    >
      <div className="flex flex-col justify-center p-4">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textDark"
          text={`${format(submitMonth, 'LLLL')} balance`}
        />
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={incomeItems}
        />
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
            text={`R ${formatCurrency(0)}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={expensesItems}
        />
        <Card
          className="bg-secondary flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total expenses'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${formatCurrency(0)}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
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
            text={`R ${formatCurrency(0)}`}
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
          detailText={`Once you submit your ${format(
            submitMonth,
            'LLLL'
          )} income statement, you will no longer be able to edit your income and expenses. Your signature will be added and your statement will be shared with SmartStart.`}
          actionButtons={[
            {
              text: 'Yes, submit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                //submitStatement();
                setConfimSubmitIncomeValues(false);
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.MONEY,
                });
              },
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
