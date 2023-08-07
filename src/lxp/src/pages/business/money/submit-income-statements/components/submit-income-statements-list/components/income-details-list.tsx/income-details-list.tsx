import { Typography, Card, StackedList, BannerWrapper } from '@ecdlink/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import {
  getChildName,
  incomesValueFunc,
  numberWithSpaces,
} from '@/utils/statements/statements-utils';
import { MonthStatementsDetailsState } from '../month-statements-details.types';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { childrenSelectors } from '@/store/children';
import { IncomeDetailsListProps } from './income-details-list.types';
import { format } from 'date-fns';

export const IncomeDetailsList: React.FC<IncomeDetailsListProps> = ({
  hideDetails,
  statementTitle,
  incomeStatements,
}) => {
  const location = useLocation<MonthStatementsDetailsState>();
  const children = useSelector(childrenSelectors.getChildren);
  const statementMonth = Number(location?.state?.month) - 1 || 0;
  const { isOnline } = useOnlineStatus();

  // TODO better mapping, or pass in mapped items
  const incomeListDetailsItems = incomeStatements?.map((item) => {
    return {
      title: item?.childUserId
        ? getChildName(item?.childUserId!, children!)
        : format(Date.parse(item.dateReceived || ''), 'dd/MM/yyyy'),
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
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
            text={`R ${String(incomesValueFunc(incomeStatements))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
