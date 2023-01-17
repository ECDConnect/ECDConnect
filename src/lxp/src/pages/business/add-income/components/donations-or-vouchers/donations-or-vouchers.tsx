import { useState, useEffect } from 'react';
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
import { AddIncomeState, donationTypes } from './donations-or-vouchers.types';
import * as styles from './donations-or-vouchers.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import {
  DonationsOrVouchersModel,
  donationsOrVouchersSchema,
} from '@/schemas/income-statements/donations-or-vouchers';

export const DonationsOrVouchers: React.FC<AddIncomeState> = ({ setType }) => {
  const [selectedDonations, setDonations] = useState<string[]>([]);

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
    note,
  } = useWatch({
    control: control,
  });

  const donationsDisabled = donations?.length === 0;
  const disabled = !date || !donationWorth || !donations || donationsDisabled;

  useEffect(() => {
    const _list = donationTypes
      ?.map((p) => {
        if (p?.type) {
          return {
            label: `${p?.type}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setDonationTypesList(_list);
  }, []);

  const handleFamilyGrantSelection = (donations: string[]) => {
    setDonations(donations);
    setPreschoolFeesValue('donations', donations);
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
        <Typography type="h2" color="textMid" text={'Donations or vouchers'} />
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
            setPreschoolFeesValue('date', date ? date.toString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
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
              handleFamilyGrantSelection(value as string[])
            }
            multiple
            selectedOptions={selectedDonations}
            color="secondary"
          />
        </div>
        <FormInput<DonationsOrVouchersModel>
          label={'How much was the donation worth?'}
          visible={true}
          nameProp={'donationWorth'}
          register={register}
          placeholder={'e.g. Paid for two months'}
          className="mt-4"
        />
        <FormInput<DonationsOrVouchersModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. R 1 000.00'}
          className="mt-4"
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => {}}
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
