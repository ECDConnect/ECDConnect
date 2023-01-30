import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
import * as styles from './other-income.styles';
import ROUTES from '@routes/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  OtherIncomeModel,
  otherIncomeSchema,
} from '@/schemas/income-statements/other-income';
import { AddIncomeState } from './other-income.types';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { statementsSelectors } from '@/store/statements';
import { newGuid } from '@/utils/common/uuid.utils';
import { useMemo } from 'react';

export const OtherIncome: React.FC<AddIncomeState> = ({ setType }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);

  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'Other';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );

  const {
    control,
    setValue: setPreschoolFeesValue,
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

  const sendIncomeUpdate = async () => {
    const incomeId = newGuid();

    await new IncomeStatementsService(
      userAuth?.auth_token!
    ).UpdateStatementsIncome(incomeId, {
      IsActive: true,
      UserId: userAuth?.id,
      // ChildUserId: child,
      Submitted: false,
      DateReceived: date,
      Notes: note,
      Description: description,
      Amount: Number(incomeAmount),
      AmountExpected: 400,
      ChildCoverAmount: 10,
      // PayTypeId: '18eb51c4-8486-a7f3-4de0-14477870e205',
      // ContributionTypeId: contributionType,
      IncomeTypeId: incomeTypeValue?.id,
    });
  };

  const handleSaveStartupSupportValues = () => {
    sendIncomeUpdate();
    setType('');
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
            setPreschoolFeesValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
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

export default OtherIncome;
