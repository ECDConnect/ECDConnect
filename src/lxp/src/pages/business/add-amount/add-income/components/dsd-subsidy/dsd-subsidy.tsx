import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './dsd-subsidy.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  DsdSubsidyModel,
  dsdSubsidySchema,
} from '@/schemas/income-statements/dsd-subsidy';
import { statementsSelectors } from '@/store/statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
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

export const DsdSubsidy: React.FC<AddIncomeState> = ({ setType, onSubmit }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();

  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'DBE Subsidy';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
  } = useForm<DsdSubsidyModel>({
    resolver: yupResolver(dsdSubsidySchema),
    mode: 'onChange',
  });

  const {
    date: selectedDate,
    date,
    childrenNumber,
    subsidyAmount,
    note,
  } = useWatch({
    control: control,
  });

  const disabled = useMemo(() => {
    return !date || !childrenNumber || !subsidyAmount;
  }, [childrenNumber, date, subsidyAmount]);

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
      Amount: subsidyAmount ? moneyInputFormat(subsidyAmount) : 0,
      AmountExpected: subsidyAmount ? moneyInputFormat(subsidyAmount) : 0,
      ChildCoverAmount: Number(childrenNumber),
      IncomeTypeId: incomeTypeValue?.id,
    };

    onSubmit(incomeInput);

    await history.push(ROUTES.BUSINESS);
  };

  const handleSaveStartupSupportValues = () => {
    sendIncomeUpdate();
  };

  const numberInputInvalidChars = ['-', '+', 'e'];

  return (
    <BannerWrapper
      title={`Add a new income type`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => setType('')}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={viewTitle} />
        <Alert
          type={'info'}
          title={
            'If you are registered with the Department of Basic Education (DBE), you may receive a subsidy for some, or all, of the children who attend your programme.'
          }
          className="mt-4 mb-2"
        />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get the subsidy?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setPreschoolFeesValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={
            todayDateNumber <= 8 ? firstDateOfPreviousMonth! : firstDateOfMonth!
          }
          maxDate={lastDateOfMonth}
        />
        <FormInput<DsdSubsidyModel>
          label={'How many children do you receive this amount for?'}
          visible={true}
          nameProp={'childrenNumber'}
          register={register}
          placeholder={'e.g. 20'}
          className="mt-2"
          type={'number'}
          onKeyDown={(e: any) => {
            if (numberInputInvalidChars.includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
        <FormInput<DsdSubsidyModel>
          label={'How much did you receive from the DBE subsidy?'}
          visible={true}
          nameProp={'subsidyAmount'}
          register={register}
          placeholder={'e.g. R 1 000.00'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!subsidyAmount}
        />
        <FormInput<DsdSubsidyModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Paid 2 days late'}
          className="mt-2"
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={handleSaveStartupSupportValues}
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

export default DsdSubsidy;
