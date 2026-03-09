import { useState } from 'react';
import {
  BannerWrapper,
  Typography,
  Button,
  Divider,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { statementsActions, statementsSelectors } from '@/store/statements';
import {
  IncomeItemDto,
  IncomeStatementDto,
  IncomeTypeIds,
  useSnackbar,
} from '@ecdlink/core';
import { endOfMonth, lastDayOfMonth, startOfMonth } from 'date-fns';
import StatementsWrapper from '@/pages/business/money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import { classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { childrenSelectors } from '@/store/children';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { newGuid } from '@/utils/common/uuid.utils';

export interface AddPreschoolFeesProps {
  onBack: () => void;
  childId: string;
}

export const AddPreschoolFees: React.FC<AddPreschoolFeesProps> = ({
  onBack,
  childId,
}) => {
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child?.userId || '')
  );

  const statements = useSelector(statementsSelectors.getIncomeStatements);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStatement, setSelectedStatement] =
    useState<IncomeStatementDto>();
  const [selectedFee, setSelectedFee] = useState<IncomeItemDto>();

  const minEditDate = new Date();
  minEditDate.setDate(minEditDate.getDate() - 60);

  const maxEditDate = lastDayOfMonth(new Date());

  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(startDate);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [updatedFee, setUpdatedFee] = useState<{
    id: string;
    childUserId: string;
    amount: string;
  }>();

  const disabled = selectedStatement?.downloaded || false;

  const getFeeForDate = (date: Date) => {
    if (!date) return;

    const monthNumber = date.getMonth() + 1;
    const year = date.getFullYear();

    const statement = statements.find(
      (x) => x.month === monthNumber && x.year === year
    );

    if (statement) {
      setSelectedStatement(statement);

      const fee = statement.incomeItems?.find(
        (y) => y.childUserId === child?.userId
      );

      if (fee) {
        setSelectedFee(fee);
        setUpdatedFee({
          id: fee.id ?? newGuid(),
          amount: fee.amount?.toString() || '',
          childUserId: child?.userId || '',
        });
      } else {
        setSelectedFee(undefined);
        setUpdatedFee({
          id: newGuid(),
          amount: '',
          childUserId: child?.userId || '',
        });
      }
    } else {
      setSelectedStatement(undefined);
      setSelectedFee(undefined);
      setUpdatedFee({
        id: newGuid(),
        amount: '',
        childUserId: child?.userId || '',
      });
    }
  };

  const onSubmit = () => {
    if (!selectedDate) return;

    const mappedFees = {
      id: updatedFee?.id,
      amount: Number(moneyInputFormat(updatedFee?.amount || '')),
      dateReceived: selectedDate.toISOString(),
      incomeTypeId: IncomeTypeIds.PRESCHOOL_FEE_ID,
      childUserId: updatedFee?.childUserId,
      isActive: true,
    } as IncomeItemDto;
    const id = selectedStatement?.id || newGuid();

    appDispatch(
      statementsActions.addOrUpdateIncomeItems({
        statementId: id,
        incomeItems: [mappedFees],
      })
    );

    showMessage({
      message: 'Preschool fee added!',
      type: 'success',
    });
    onBack();
  };

  return (
    <BannerWrapper
      title={`Add preschool fees`}
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
        {/*!!statement?.downloaded && (
          <Alert
            type={'warning'}
            title={
              'You can only view this item. You cannot edit it because you have downloaded the statement, or the statement is more than 60 days old.'
            }
            className="mt-6"
          />
        )*/}
        <Typography
          className={'mr-1 mt-4'}
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
          onChange={(date: Date) => {
            setSelectedDate(date);
            getFeeForDate(date);
          }}
        />
        <Divider dividerType="dashed" className="mt-4" />
        <Typography
          type="h4"
          color="textDark"
          text={`${classroomGroup?.name}` || 'No class'}
        />
        <FormInput<Number>
          label={`${child?.user?.firstName} ${child?.user?.surname}`}
          visible={true}
          className="mt-2"
          type={'text'}
          value={moneyInputFormat(updatedFee?.amount.toString() ?? '0')}
          textInputType={'moneyInput'}
          prefixIcon={true}
          disabled={disabled}
          onChange={(event) => {
            // Updated existing
            setUpdatedFee({
              id: selectedFee?.id ?? newGuid(),
              amount: event.target.value,
              childUserId: child?.userId || '',
            });
          }}
        />
        <Divider dividerType="dashed" className="mt-4" />
        <Button
          shape="normal"
          color="quatenary"
          type="filled"
          icon="SaveIcon"
          className="mt-6 rounded-2xl"
          disabled={!selectedDate || disabled}
          onClick={() => onSubmit()}
        >
          <Typography type="body" color="white" text="Save" />
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default AddPreschoolFees;
