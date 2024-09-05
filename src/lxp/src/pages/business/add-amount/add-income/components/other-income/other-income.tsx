import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  FormInput,
  Alert,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './other-income.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import {
  OtherIncomeModel,
  otherIncomeSchema,
} from '@/schemas/income-statements/other-income';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { isBefore, lastDayOfMonth, startOfMonth } from 'date-fns';
import { AddIncomeProps } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';

export const OtherIncome: React.FC<AddIncomeProps> = ({
  onBack,
  onSubmit,
  incomeItem,
}) => {
  const {
    trigger,
    control,
    setValue: setValue,
    register,
  } = useForm<OtherIncomeModel>({
    resolver: yupResolver(otherIncomeSchema),
    mode: 'onBlur',
    defaultValues: {
      dateReceived: incomeItem?.dateReceived,
      amount: incomeItem?.amount.toString(),
      notes: incomeItem?.notes,
    },
  });

  const { isValid, errors } = useFormState({
    control: control,
  });

  const { dateReceived, amount, notes } = useWatch({
    control: control,
  });

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const minEditDate = !!incomeItem
    ? startOfMonth(new Date(incomeItem.dateReceived))
    : sixtyDaysAgo;

  const maxEditDate = !!incomeItem
    ? lastDayOfMonth(new Date(incomeItem.dateReceived))
    : lastDayOfMonth(new Date());

  const sendIncomeUpdate = async () => {
    const incomeInput: IncomeItemDto = {
      id: incomeItem?.id ?? newGuid(),
      dateReceived: dateReceived!,
      amount: !!amount ? Number(moneyInputFormat(amount)) : 0,
      incomeTypeId: IncomeTypeIds.OTHER_INCOME_ID,
      notes: notes,
    };

    onSubmit(incomeInput);
  };

  const statementDate = !!dateReceived ? new Date(dateReceived) : new Date();
  const statement = useSelector(
    statementsSelectors.getStatementForMonth(
      statementDate.getFullYear(),
      statementDate.getMonth() + 1
    )
  );

  const disabled =
    (dateReceived && !!statement?.downloaded) ||
    (!!incomeItem && isBefore(new Date(incomeItem.dateReceived), sixtyDaysAgo));

  const month = !!dateReceived
    ? getMonthName(new Date(dateReceived).getMonth())
    : '';

  return (
    <BannerWrapper
      title={`Other income`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      showBackground={false}
      onBack={onBack}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="primary" text={'Other income type'} />
        {disabled && !!incomeItem && (
          <Alert
            type={'warning'}
            title={
              'You can only view this item. You cannot edit it because you have downloaded the statement, or the statement is more than 60 days old.'
            }
            className="mt-6"
          />
        )}
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get this income?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-primary mx-auto w-full rounded-md border-none"
          selected={dateReceived ? new Date(dateReceived) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setValue('dateReceived', date ? date.toISOString() : '');
            trigger();
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={minEditDate}
          maxDate={maxEditDate}
          disabled={disabled && !!incomeItem}
        />
        {disabled && !incomeItem && (
          <Alert
            type={'warning'}
            title={`You cannot add an item in ${month} because you have already downloaded the ${month} statement.`}
            className="mt-6"
          />
        )}
        <FormInput<OtherIncomeModel>
          label={'How much do you get from this income type?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={!disabled ? 'e.g. R 50.00' : ''}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
          disabled={disabled}
          value={!!amount ? moneyInputFormat(amount) : undefined}
        />
        <FormInput<OtherIncomeModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={!disabled ? 'e.g. Small grant from local shop' : ''}
          className="mt-2"
          error={errors['notes']}
          disabled={disabled}
        />
        {!disabled && (
          <Button
            type="filled"
            color="quatenary"
            className={'mx-auto mt-8 w-full rounded-2xl'}
            onClick={() => {
              sendIncomeUpdate();
            }}
            disabled={!isValid || disabled}
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="help"
              className="mr-2"
              color="white"
              text={'Save'}
            ></Typography>
          </Button>
        )}
        {disabled && (
          <Button
            type="outlined"
            color="quatenary"
            className={'mx-auto mt-8 w-full rounded-2xl'}
            onClick={() => {
              onBack();
            }}
          >
            {renderIcon('XIcon', 'h-4 w-4 text-quatenary mr-2')}
            <Typography
              type="body"
              className="mr-2"
              color="quatenary"
              text={'Close'}
            ></Typography>
          </Button>
        )}
      </div>
    </BannerWrapper>
  );
};

export default OtherIncome;
