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
import { AddIncomeState } from './dsd-subsidy.types';
import { statementsSelectors } from '@/store/statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';

export const DsdSubsidy: React.FC<AddIncomeState> = ({ setType }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);

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

  const disabled = !date || !childrenNumber || !subsidyAmount;

  const sendIncomeUpdate = async () => {
    await new IncomeStatementsService(
      userAuth?.auth_token!
    ).UpdateStatementsIncome('e009be2b-ed1a-4559-a386-953c0369bbf0', {
      IsActive: true,
      UserId: 'ab2b798b-5de9-4730-990b-472a9e33491e',
      // ChildUserId: child,
      Submitted: false,
      DateReceived: date,
      Notes: note,
      // Description: 'Testing',
      Amount: Number(subsidyAmount),
      AmountExpected: 400,
      ChildCoverAmount: Number(childrenNumber),
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
            setPreschoolFeesValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
        />
        <FormInput<DsdSubsidyModel>
          label={'How many children do you receive this amount for?'}
          visible={true}
          nameProp={'childrenNumber'}
          register={register}
          placeholder={'e.g. 20'}
          className="mt-2"
          type={'number'}
        />
        <FormInput<DsdSubsidyModel>
          label={'How much did you receive from the DBE subsidy?'}
          visible={true}
          nameProp={'subsidyAmount'}
          register={register}
          placeholder={'e.g. R 1 000.00'}
          className="mt-2"
          type={'number'}
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
