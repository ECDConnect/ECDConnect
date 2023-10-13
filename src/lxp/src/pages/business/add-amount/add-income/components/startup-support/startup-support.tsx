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
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import {
  isNumber,
  moneyInputFormat,
} from '@/utils/statements/statements-utils';
import { getDate, lastDayOfMonth, startOfMonth } from 'date-fns';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { practitionerSelectors } from '@/store/practitioner';
import { AddIncomeState } from '../../../add-amount.types';
import { StatementsIncomeInput } from '@ecdlink/graphql';
import { statementsSelectors } from '@/store/statements';
import { newGuid } from '@/utils/common/uuid.utils';

export const StartupSupport: React.FC<AddIncomeState> = ({
  setType,
  onSubmit,
}) => {
  const [confirmStartupValue, setConfirmStartupValue] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
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

  const disabled = useMemo(() => {
    return !date || !startupValue;
  }, [date, startupValue]);

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
      Amount: startupValue ? moneyInputFormat(startupValue) : 0,
      AmountExpected: startupValue ? moneyInputFormat(startupValue) : 0,
      ChildCoverAmount: 0,
      IncomeTypeId: incomeTypeValue?.id,
    };

    onSubmit(incomeInput);

    await history.push(ROUTES.BUSINESS);
  };

  const handleSaveStartupSupportValues = () => {
    sendIncomeUpdate();
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
        {!!practitioner?.stipendType && !!practitioner?.isOnStipend && (
          <Typography
            type="h3"
            color={'primary'}
            text={`${practitioner?.stipendType}`}
            className="mt-2"
          />
        )}
        {(!practitioner?.stipendType || !practitioner?.isOnStipend) && (
          <Alert
            type="warning"
            className="mt-4"
            title="We do not have start-up support information on-record for you"
            list={[
              'If you receive start-up support, please fill in the information below and SmartStart will be notified to change the information they have on record.',
              'If you do not receive start-up support, please use the back button and choose a different income type.',
            ]}
            customIcon={
              <div className="rounded-full">
                {renderIcon('ExclamationCircleIcon', 'text-alertMain w-5 h-5')}
              </div>
            }
          />
        )}
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get this start-up support?
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
        <FormInput<StartupSupportModel>
          label={'How much do you get from start-up support?'}
          visible={true}
          nameProp={'startupValue'}
          register={register}
          placeholder={'e.g. R 2000'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!startupValue}
        />

        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => setConfirmStartupValue(true)}
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
