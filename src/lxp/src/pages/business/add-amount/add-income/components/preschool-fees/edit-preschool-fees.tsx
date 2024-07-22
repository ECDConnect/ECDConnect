import { useCallback } from 'react';
import { BannerWrapper, Typography, Divider, Alert } from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import { IncomeItemDto } from '@ecdlink/core';
import StatementsWrapper from '@/pages/business/money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { classroomsSelectors } from '@/store/classroom';
import PreschoolFees from './preschool-fees';
import { useAppDispatch } from '@/store';
import { BusinessTabItems } from '@/pages/business/business.types';

export interface EditPreschoolFeeProps {
  onBack: () => void;
  incomeItem: IncomeItemDto;
}

export const EditPreschoolFees: React.FC<EditPreschoolFeeProps> = ({
  onBack,
  incomeItem,
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(incomeItem.childUserId!)
  );

  const onSubmit = useCallback(
    (incomeItems: IncomeItemDto[], statementId?: string) => {
      appDispatch(
        statementsActions.addOrUpdateIncomeItems({ statementId, incomeItems })
      );
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.MONEY,
      });
    },
    []
  );

  const date = new Date(incomeItem.dateReceived);

  const statement = useSelector(
    statementsSelectors.getStatementForMonth(
      date.getFullYear(),
      date.getMonth() + 1
    )
  );

  return (
    <BannerWrapper
      title={`Add preschool fee`}
      subTitle={`Step ${2} of 2`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      showBackground={false}
      onBack={onBack}
      className="p-4"
    >
      <div className="flex flex-col justify-center p-4">
        <Typography type="h2" color="textDark" text={'Preschool fees'} />
        {!!statement?.downloaded && (
          <Alert
            type={'warning'}
            title={
              'You can only view this item. You cannot edit it because you have downloaded the statement, or the statement is more than 60 days old.'
            }
            className="mt-6"
          />
        )}
        <Typography
          className={'mr-1'}
          type={'h2'}
          color={'primary'}
          text={'How much did each caregiver pay?'}
        />
        <Divider dividerType="dashed" className="mt-4" />
        <Typography
          className={'mr-1'}
          type={'h4'}
          color={'primary'}
          text={'Which month would you like to add fees for?'}
        />
        <DatePicker
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          dateFormat={'MMMM yyyy'}
          showMonthYearPicker
          showFullMonthYearPicker
          selected={date}
          disabled={true}
          onChange={() => {}}
        />
        <PreschoolFees
          month={date.getMonth()}
          year={date.getFullYear()}
          classroomGroupIds={[classroomGroup!.id]}
          onSubmit={onSubmit}
        />
      </div>
    </BannerWrapper>
  );
};

export default EditPreschoolFees;
