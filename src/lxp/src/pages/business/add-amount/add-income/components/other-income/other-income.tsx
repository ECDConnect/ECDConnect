import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './other-income.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  OtherIncomeModel,
  otherIncomeSchema,
} from '@/schemas/income-statements/other-income';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { statementsSelectors } from '@/store/statements';
import { useMemo } from 'react';
import {
  isNumber,
  moneyInputFormat,
} from '@/utils/statements/statements-utils';
import { getDate, lastDayOfMonth, startOfMonth } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { StatementsIncomeInput } from '@ecdlink/graphql';
import { AddIncomeState } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';

export const OtherIncome: React.FC<AddIncomeState> = ({
  setType,
  onSubmit,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();

  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'Other';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );

  const {
    control,
    setValue: setValue,

    register,
  } = useForm<OtherIncomeModel>({
    resolver: yupResolver(otherIncomeSchema),
    mode: 'onChange',
  });

  const {
    date: selectedDate,
    date,
    incomeAmount,
    description,
    note,
  } = useWatch({
    control: control,
  });

  const disabled = useMemo(() => {
    return !date || !incomeAmount || !description;
  }, [date, description, incomeAmount]);

  const today = new Date();
  const todayDateNumber = getDate(today);
  const firstDateOfMonth = startOfMonth(today);
  const firstDateOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDateOfMonth = lastDayOfMonth(today);

  const sendIncomeUpdate = async () => {
    const incomeInput: StatementsIncomeInput = {
      Id: newGuid(),
      IsActive: true,
      UserId: userAuth?.id,
      Submitted: false,
      DateReceived: date,
      Notes: note,
      Description: description,
      Amount: incomeAmount ? moneyInputFormat(incomeAmount) : 0,
      AmountExpected: incomeAmount ? moneyInputFormat(incomeAmount) : 0,
      ChildCoverAmount: 0,
      IncomeTypeId: incomeTypeValue?.id,
    };

    onSubmit(incomeInput);

    await history.push(ROUTES.BUSINESS);
  };

  return (
    <BannerWrapper
      title={`Other income`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => setType('')}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={viewTitle} />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get this income?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={
            todayDateNumber <= 8 ? firstDateOfPreviousMonth! : firstDateOfMonth!
          }
          maxDate={lastDateOfMonth}
        />
        <FormInput<OtherIncomeModel>
          label={'How much do you get from this income type?'}
          visible={true}
          nameProp={'incomeAmount'}
          register={register}
          placeholder={'e.g. R 50.00'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!incomeAmount}
        />
        <FormInput<OtherIncomeModel>
          label={'Write a short description of this income type'}
          subLabel="Writing a clear description will help you to reuse this income type again in future."
          visible={true}
          nameProp={'description'}
          register={register}
          placeholder={'e.g. ABC grocery grant'}
          className="mt-2"
        />
        <FormInput<OtherIncomeModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Small grant from local shop'}
          className="mt-2"
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => {
            sendIncomeUpdate();
            setType('');
          }}
          disabled={disabled}
        >
          {renderIcon('SaveIcon', styles.buttonIcon)}
          <Typography
            type="help"
            className="mr-2"
            color="white"
            text={'Save'}
          ></Typography>
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default OtherIncome;
