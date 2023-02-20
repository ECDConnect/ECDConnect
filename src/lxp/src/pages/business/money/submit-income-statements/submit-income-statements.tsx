import ROUTES from '@/routes/routes';
import { statementsSelectors } from '@/store/statements';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import { Typography, StatusChip, Button, Card, FADButton } from '@ecdlink/ui';
import { differenceInDays, format, getMonth, setDate } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';

export const SubmitIncomeStatements: React.FC = () => {
  const history = useHistory();
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const monthNames = balanceSheet?.map((item) => {
    return getMonthName(item?.month! - 1).substring(0, 3);
  });

  const monthDateNumber = getMonth(new Date()) + 1;

  const previousMonthRecord =
    monthNames?.length! > 1 && balanceSheet?.length! > 1
      ? `${monthNames?.[1]} ${balanceSheet?.[1]?.year}`
      : `-`;

  const currentMonthRecord =
    monthNames && balanceSheet?.length! > 0
      ? `${monthNames?.[0]} ${balanceSheet?.[0]?.year}`
      : `-`;

  const currentMonthTotalIncome =
    balanceSheet?.length! > 0
      ? `+ R ${balanceSheet?.[0]?.incomeTotal?.toFixed(2)}`
      : '-';
  const currentMonthTotalExpenses =
    balanceSheet?.length! > 0
      ? `- R ${balanceSheet?.[0]?.expenseTotal?.toFixed(2)}`
      : '-';

  const previousMonthTotalIncome =
    balanceSheet?.length! > 1
      ? `+ R ${balanceSheet?.[1].incomeTotal?.toFixed(2)}`
      : '-';
  const previousMonthTotalExpenses =
    balanceSheet?.length! > 1
      ? `- R ${balanceSheet?.[1].expenseTotal?.toFixed(2)}`
      : '-';

  const currentMonthTotalBalance =
    balanceSheet?.length! > 0 ? balanceSheet?.[0].balance?.toFixed(2) : 0;

  const previousMonthTotalBalance =
    balanceSheet?.length! > 1 ? balanceSheet?.[1].balance?.toFixed(2) : 0;

  const formatCurrentValue = (value: number) => {
    if (value === 0) return `R ${numberWithSpaces(String(value.toFixed(2)))}`;

    if (value > 0) return `+ R ${numberWithSpaces(String(value.toFixed(2)))}`;

    if (value < 0) return `- R ${numberWithSpaces(String(value.toFixed(2)))}`;
  };

  const today = new Date();
  const submitDateDaysCount = differenceInDays(setDate(new Date(), 25), today);

  const firstDateToSubmit = useMemo(() => setDate(new Date(), 25), []);
  const lastDayToSubmit = useMemo(() => setDate(new Date(), 7), []);

  const enableSubmit = today <= lastDayToSubmit || today >= firstDateToSubmit;

  useEffect(() => {
    if (balanceSheet?.filter((e) => e.month === monthDateNumber).length! > 0) {
      setDisableSubmit(true);
    }
  }, [balanceSheet, monthDateNumber]);

  return (
    <>
      <div className="flex flex-col justify-center p-4">
        <div className="flex items-center">
          <StatusChip
            backgroundColour={
              submitDateDaysCount > 8 ? 'successMain' : 'alertMain'
            }
            borderColour={submitDateDaysCount > 8 ? 'successMain' : 'alertMain'}
            text={`${submitDateDaysCount} days`}
            textColour={'white'}
            className={'mr-2'}
          />
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textDark"
            text={'To submit next income statement'}
          />
        </div>
        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="ArrowCircleRightIcon"
          onClick={() =>
            history.push(ROUTES.BUSINESS_SUBMIT_INCOME_STATEMENTS_LIST)
          }
          className="mt-6 rounded-2xl"
          disabled={disableSubmit || !enableSubmit}
        >
          <Typography
            type="help"
            color="white"
            text="Submit income statement"
          />
        </Button>
        <Card
          className="bg-primaryAccent1 mt-4 flex items-center justify-around p-4"
          borderRaduis={'xl'}
          shadowSize={'md'}
        >
          <Typography
            text={`${format(new Date(), 'LLLL')} balance`}
            type="h4"
            color={'white'}
            className="w-6/12"
          />
          <Typography
            text={`${formatCurrentValue(Number(currentMonthTotalBalance))}`}
            color={'white'}
            type="h1"
            className="w-8/12 text-right"
          />
        </Card>
        <table className="mt-4">
          <tbody>
            <tr className="bg-uiBg text-textDark font-body border-secondary h-12 w-1/3 border-b px-6 py-3">
              <th className="w-1/3"></th>
              <th className="text-textDark font-body">
                <Typography
                  text={previousMonthRecord}
                  type="body"
                  color={'textDark'}
                />
              </th>
              <th className="w-1/3">
                <Typography
                  text={currentMonthRecord}
                  type="body"
                  color={'textDark'}
                />
              </th>
            </tr>
            <tr className="h-14">
              <td className="w-1/3">
                <Typography
                  text={`Income`}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={previousMonthTotalIncome}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={currentMonthTotalIncome}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
            </tr>
            <tr className="bg-uiBg h-14">
              <td className="w-1/3">
                <Typography
                  text={`Expenses`}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={previousMonthTotalExpenses}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={currentMonthTotalExpenses}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
            </tr>
            <tr className=" h-14">
              <td className="w-1/3">
                <Typography
                  text={`Balance`}
                  weight="bold"
                  type="body"
                  color={'textDark'}
                  align={'center'}
                  className="font-bold"
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={formatCurrentValue(Number(previousMonthTotalBalance))}
                  type="body"
                  color={'successMain'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={formatCurrentValue(Number(currentMonthTotalBalance))}
                  type="body"
                  color={
                    currentMonthTotalBalance! >= 0 ? 'successMain' : 'errorMain'
                  }
                  align={'center'}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="DocumentSearchIcon"
          onClick={() => history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST)}
          className="mt-6 rounded-2xl"
        >
          <Typography type="help" color="white" text="See all statements" />
        </Button>
        <div className="flex justify-end">
          <FADButton
            title={'Add income or expense'}
            icon={'PlusIcon'}
            iconDirection={'left'}
            textToggle={true}
            type={'filled'}
            color={'primary'}
            shape={'round'}
            className="mt-8 py-2.5"
            click={() => history.push(ROUTES.BUSINESS_ADD_AMOUNT)}
          />
        </div>
      </div>
    </>
  );
};
