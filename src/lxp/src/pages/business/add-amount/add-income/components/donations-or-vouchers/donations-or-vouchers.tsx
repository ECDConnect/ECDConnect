import { useState, useEffect, useMemo } from 'react';
import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  classNames,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './donations-or-vouchers.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  DonationsOrVouchersModel,
  donationsOrVouchersSchema,
} from '@/schemas/income-statements/donations-or-vouchers';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import {
  isNumber,
  moneyInputFormat,
} from '@/utils/statements/statements-utils';
import { getDate, lastDayOfMonth, startOfMonth } from 'date-fns';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { AddIncomeState } from '../../../add-amount.types';
import { StatementsIncomeInput } from '@ecdlink/graphql';
import { newGuid } from '@/utils/common/uuid.utils';

export const DonationsOrVouchers: React.FC<AddIncomeState> = ({
  setType,
  onSubmit,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [selectedDonations, setDonations] = useState<string[]>([]);
  const history = useHistory();

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
  } = useForm<DonationsOrVouchersModel>({
    resolver: yupResolver(donationsOrVouchersSchema),
    mode: 'onChange',
  });

  const [donationTypesList, setDonationTypesList] = useState<
    { label: string; value: any }[]
  >([]);

  const {
    date: selectedDate,
    date,
    donationWorth,
    donations,
  } = useWatch({
    control: control,
  });

  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const viewTitle = 'Donation';
  const incomeTypeValue = incomeTypes.find(
    (item) => item.description === viewTitle
  );

  const payTypes = useSelector(statementsSelectors.getPayTypes);
  const donationsDisabled = donations?.length === 0;
  const disabled = useMemo(() => {
    return !date || !donationWorth || !donations || donationsDisabled;
  }, [date, donationWorth, donations, donationsDisabled]);

  const today = new Date();
  const todayDateNumber = getDate(today);
  const firstDateOfMonth = startOfMonth(today);
  const firstDateOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const lastDateOfMonth = lastDayOfMonth(today);

  useEffect(() => {
    const _list = payTypes
      ?.map((p) => {
        if (p?.description) {
          return {
            label: `${p?.description}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setDonationTypesList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDonationsValue = (donations: string[]) => {
    setDonations(donations);
    setPreschoolFeesValue('donations', donations);
  };

  const sendIncomeUpdate = async () => {
    const incomeInput: StatementsIncomeInput = {
      Id: newGuid(),
      IsActive: true,
      UserId: userAuth?.id,
      Submitted: false,
      DateReceived: date,
      Amount: donationWorth ? moneyInputFormat(donationWorth) : 0,
      AmountExpected: donationWorth ? moneyInputFormat(donationWorth) : 0,
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
      title={`Add donations or vouchers`}
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
            'All contributions that you receive for your programme. This could include vouchers, food or educational supplies given to your business. This is usually because of your fundraising efforts.'
          }
          className="mt-4 mb-2"
        />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you get this donation/voucher?
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
        <label className={classNames(styles.label, 'mt-4')}>
          {
            'Was the donation an item like groceries or toys, money, or a voucher for a particular shop? '
          }
        </label>
        <div className={'mt-2'}>
          <ButtonGroup<string>
            type={ButtonGroupTypes.Button}
            options={
              donationTypesList?.map((type) => ({
                text: type.label,
                value: type.value ?? '',
              })) || []
            }
            onOptionSelected={(value: string | string[]) =>
              handleDonationsValue(value as string[])
            }
            multiple={false}
            selectedOptions={selectedDonations}
            color="secondary"
          />
        </div>
        <FormInput<DonationsOrVouchersModel>
          label={'How much was the donation worth?'}
          visible={true}
          nameProp={'donationWorth'}
          register={register}
          placeholder={'e.g. R 1 000.00'}
          className="mt-4"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!donationWorth}
        />
        <FormInput<DonationsOrVouchersModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Food donation from local shop'}
          className="mt-4"
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

export default DonationsOrVouchers;
