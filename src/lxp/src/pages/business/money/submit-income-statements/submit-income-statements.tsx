import ROUTES from '@/routes/routes';
import { statementsSelectors } from '@/store/statements';
import { Typography, StatusChip, Button, Card, FADButton } from '@ecdlink/ui';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const SubmitIncomeStatements: React.FC = () => {
  const history = useHistory();
  const income = useSelector(statementsSelectors.getIncome);
  const expenses = useSelector(statementsSelectors.getExpenses);

  const totalIncome = income?.reduce(function (prev: any, current: any) {
    return prev + +current.amount;
  }, 0);

  const totalExpenses = expenses?.reduce(function (prev: any, current: any) {
    return prev + +current.amount;
  }, 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <>
      <div className="flex flex-col justify-center p-4">
        <div className="flex">
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`9 days`}
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
            text={
              totalBalance > 0
                ? `R ${String(totalBalance)}`
                : `R ${String(totalBalance)}`
            }
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
                <Typography text={`NOV 2021`} type="body" color={'textDark'} />
              </th>
              <th className="w-1/3">
                <Typography text={`DEZ 2021`} type="body" color={'textDark'} />
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
                  text={`+ R 2 000.00`}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={`+ R 1 800.00`}
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
                  text={`- R 2 700.00 `}
                  type="body"
                  color={'textDark'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={`- R 1 700.00 `}
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
                  text={`+ R 300.10 `}
                  type="body"
                  color={'successMain'}
                  align={'center'}
                />
              </td>
              <td className="w-1/3">
                <Typography
                  text={`+ R 100.10 `}
                  type="body"
                  color={'successMain'}
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
          onClick={() => {}}
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
