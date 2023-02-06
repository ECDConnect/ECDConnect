import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  FormInput,
  DialogPosition,
  Dialog,
  ActionModal,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './startup-support.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  StartupSupportModel,
  StartupSupportSchema,
} from '@/schemas/income-statements/startup-support';
import { useMemo, useState } from 'react';
import { AddIncomeState } from './startup-support.types';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  isNumber,
  moneyInputFormat,
} from '@/utils/statements/statements-utils';

export const StartupSupport: React.FC<AddIncomeState> = ({ setType }) => {
  const [confirmStartupValue, setConfirmStartupValue] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  // const feeTypes = useSelector(statementsSelectors.getFeeTypes);
  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'Startup Support';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
  } = useForm<StartupSupportModel>({
    resolver: yupResolver(StartupSupportSchema),
    mode: 'onChange',
  });

  const {
    date: selectedDate,
    date,
    startupValue,
  } = useWatch({
    control: control,
  });

  const isNum = isNumber(startupValue!);
  const disabled = useMemo(() => {
    return !date || !startupValue;
  }, [date, startupValue]);

  const sendIncomeUpdate = async () => {
    const incomeId = newGuid();

    await new IncomeStatementsService(
      userAuth?.auth_token!
    ).UpdateStatementsIncome(incomeId, {
      IsActive: true,
      UserId: userAuth?.id,
      Submitted: false,
      DateReceived: date,
      Amount: startupValue ? moneyInputFormat(startupValue) : 0,
      AmountExpected: 400,
      ChildCoverAmount: 400,
      IncomeTypeId: incomeTypeValue?.id,
    });
  };

  const handleSaveStartupSupportValues = () => {
    sendIncomeUpdate();
    setType('');
  };

  return (
    <BannerWrapper
      title={`Add start-up support`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => setType('')}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={'Start-up support'} />
        <Alert
          type={'info'}
          title={
            'Funding organised by SmartStart to support your business at its start. This may come from SmartStart or partners.'
          }
          className="mt-4 mb-2"
        />
        <Typography
          type="h3"
          color={'primary'}
          text={'Community Works Programme (CWP)'}
          className="mt-2"
        />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get this start-up support?
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
        <FormInput<StartupSupportModel>
          label={'How much do you get from start-up support?'}
          visible={true}
          nameProp={'startupValue'}
          register={register}
          placeholder={'e.g. Paid for two months'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!startupValue}
        />
        <Alert
          type={'info'}
          title={'This start-up support will end in February 2021.'}
          className="mt-4"
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => setConfirmStartupValue(true)}
          disabled={disabled || !isNum}
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
      <Dialog
        className={'mb-16 px-4'}
        stretch
        visible={confirmStartupValue}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to edit your start-up support details?`}
          detailText={
            'Please check to make sure that the information you entered is correct before saving.'
          }
          actionButtons={[
            {
              text: 'Yes, save changes',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: handleSaveStartupSupportValues,
              leadingIcon: 'SaveIcon',
            },
            {
              text: 'No, exit',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                setConfirmStartupValue(false);
              },
              leadingIcon: 'ArrowLeftIcon',
            },
          ]}
        />
      </Dialog>
    </BannerWrapper>
  );
};

export default StartupSupport;
