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
import { PreschoolFeesChildListProps } from './preschool-fees-child-list.types';
import { childrenSelectors } from '@/store/children';

export const PreschoolsFeesChildList: React.FC<PreschoolFeesChildListProps> = ({
  setShowPreschoolDetails,
  preschoolFees,
}) => {
  const location = useLocation<MonthStatementsDetailsState>();
  const children = useSelector(childrenSelectors.getChildren);
  const statementMonth = Number(location?.state?.month) - 1 || 0;
  const statementTitle = `Preschool fees`;
  const { isOnline } = useOnlineStatus();

  const preschoolListDetailsItems = preschoolFees?.map((item) => {
    return {
      title: getChildName(item?.childUserId!, children!),
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
      onBack={() => setShowPreschoolDetails(false)}
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
        {preschoolListDetailsItems && (
          <StackedList
            className="mt-4 flex w-full flex-col"
            type="MenuList"
            listItems={preschoolListDetailsItems}
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
            text={`R ${String(incomesValueFunc(preschoolFees))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
