import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
} from '@ecdlink/ui';
import React, { useMemo, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  formatCurrency,
  getStatementsBalance,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { IncomeStatementDto } from '@ecdlink/core';

export type PreviousStatementsListProps = {
  statements: IncomeStatementDto[];
  onBack: () => void;
  onActionClick: (statementId: string) => void;
  fetchStatementsForYear: (year: number) => void;
};

export const PreviousStatementsList: React.FC<PreviousStatementsListProps> = ({
  statements,
  onBack,
  onActionClick,
  fetchStatementsForYear,
}) => {
  const { isOnline } = useOnlineStatus();

  const [years, setYears] = useState<number[]>([new Date().getFullYear()]);

  const groupedStatements = useMemo(() => {
    return years.map((year) => {
      const statementsForYear = statements.filter((s) => s.year === year);
      const balanceForYear = getStatementsBalance(statementsForYear);

      return {
        year: year,
        balance: balanceForYear,
        statements: statementsForYear.map((item) => ({
          title: `${getMonthName(item.month - 1)} ${item.year}`,
          titleStyle: 'text-textDark font-semibold text-base leading-snug',
          subTitleStyle:
            'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
          text: '1',
          onActionClick: () => onActionClick(item.id),
          classNames: 'bg-uiBg',
          notRounded: true,
        })),
      };
    });
  }, [years, statements, onActionClick]);

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
        {groupedStatements.map((yearSummary) => {
          return (
            <div className="mt-5">
              <Typography
                type="h2"
                weight="bold"
                color="textDark"
                text={`${yearSummary.year}`}
              />
              <StackedList
                className="mt-4 flex w-full flex-col gap-1"
                type="MenuList"
                listItems={yearSummary.statements}
              />
              <Card
                className={`bg-${
                  yearSummary.balance > 0 ? 'successMain' : 'secondary'
                } mt-2 flex items-center justify-between p-4`}
                shadowSize={'md'}
              >
                <Typography
                  text={yearSummary.balance > 0 ? 'Profit' : 'Loss'}
                  type="body"
                  color={'white'}
                  className="w-9/12"
                />
                <Typography
                  text={`R ${formatCurrency(yearSummary.balance)}`}
                  color={'white'}
                  type="h4"
                  className="mr-4 w-5/12 text-right"
                />
              </Card>
            </div>
          );
        })}
        {/* TODO - hide button if lowest year does not have all 12 statements (They probably wouldn't have data from before then anyway?) */}
        <Button
          shape="normal"
          color="quatenary"
          type="filled"
          icon="DocumentSearchIcon"
          onClick={() => {
            const newYear = years[years.length - 1] - 1;
            setYears([...years, newYear]);
            fetchStatementsForYear(newYear);
          }}
          className="mt-6 rounded-2xl"
        >
          <Typography type="help" color="white" text="See more statements" />
        </Button>
      </div>
    </BannerWrapper>
  );
};
