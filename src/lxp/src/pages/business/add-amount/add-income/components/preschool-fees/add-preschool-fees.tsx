import { useState, useCallback } from 'react';
import { BannerWrapper, Typography, Button, Alert, Divider } from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import { IncomeItemDto } from '@ecdlink/core';
import { lastDayOfMonth } from 'date-fns';
import StatementsWrapper from '@/pages/business/money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { AddPreschoolFeesProps } from '../../../add-amount.types';
import { classroomsSelectors } from '@/store/classroom';
import CheckboxCard from '@/components/checkbox-card/checkbox-card';
import PreschoolFees from './preschool-fees';
import { useAppDispatch } from '@/store';
import { BusinessTabItems } from '@/pages/business/business.types';

export const AddPreschoolFees: React.FC<AddPreschoolFeesProps> = ({
  onBack,
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const [step, setStep] = useState<number>(1);
  const [classroomGroupIds, setClassroomGroupIds] = useState<string[]>([]);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const minEditDate = new Date();
  minEditDate.setDate(minEditDate.getDate() - 60);

  const maxEditDate = lastDayOfMonth(new Date());

  const statement = useSelector(
    statementsSelectors.getStatementForMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1
    )
  );

  return (
    <BannerWrapper
      title={`Add preschool fee`}
      subTitle={`Step ${step} of 2`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      showBackground={false}
      onBack={onBack}
      className="p-4"
    >
      <StatementsWrapper />
      <div className="flex flex-col justify-center p-4">
        <Typography type="h2" color="textDark" text={'Preschool fees'} />
        {step === 1 && (
          <>
            <Typography
              className={'mr-1 mt-6'}
              type={'h3'}
              color={'textDark'}
              text={'Which classes would you like to record fees for?'}
            />
            {!classroomGroups.length && (
              <Alert
                type={'info'}
                title={
                  "You don't have any classes yet. Add classes to get started"
                }
                className="mt-6"
              />
            )}
            {classroomGroups.map((classroomGroup) => (
              <CheckboxCard
                className="mt-2"
                checked={classroomGroupIds.some((x) => x === classroomGroup.id)}
                onCheckboxChange={() => {
                  if (classroomGroupIds.some((x) => x === classroomGroup.id)) {
                    setClassroomGroupIds(
                      classroomGroupIds.filter((x) => x !== classroomGroup.id)
                    );
                  } else {
                    setClassroomGroupIds([
                      ...classroomGroupIds,
                      classroomGroup.id,
                    ]);
                  }
                }}
                key={classroomGroup.id}
                description={classroomGroup.name}
                checkboxColor="quatenary"
                checkedFocusColour="quatenary"
              />
            ))}
            <Button
              shape="normal"
              color="quatenary"
              type="filled"
              icon="ArrowCircleRightIcon"
              className="mt-6 rounded-2xl"
              disabled={!classroomGroupIds.length}
              onClick={() => setStep(2)}
            >
              <Typography type="body" color="white" text="Next" />
            </Button>
          </>
        )}
        {step === 2 && (
          <>
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
              className="bg-uiBg text-primary mx-auto w-full rounded-md border-none"
              dateFormat={'MMMM yyyy'}
              showMonthYearPicker
              showFullMonthYearPicker
              selected={selectedDate}
              minDate={minEditDate}
              maxDate={maxEditDate}
              onChange={(date: Date) => setSelectedDate(date)}
            />
            <PreschoolFees
              month={selectedDate.getMonth()}
              year={selectedDate.getFullYear()}
              classroomGroupIds={classroomGroupIds}
              onSubmit={onSubmit}
            />
          </>
        )}
      </div>
    </BannerWrapper>
  );
};

export default AddPreschoolFees;
