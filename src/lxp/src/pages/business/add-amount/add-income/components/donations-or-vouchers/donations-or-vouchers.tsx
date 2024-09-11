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
import { useForm, useFormState, useWatch } from 'react-hook-form';
import {
  DonationsOrVouchersModel,
  donationsOrVouchersSchema,
} from '@/schemas/income-statements/donations-or-vouchers';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { isBefore, lastDayOfMonth, startOfMonth } from 'date-fns';
import { AddIncomeProps } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { IncomeItemDto, IncomeTypeIds, PayTypeIds } from '@ecdlink/core';
import { useAppContext } from '@/walkthrougContext';
import StatementsWrapper from '../../../../money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '@/pages/business/business.types';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';

export const DonationsOrVouchers: React.FC<AddIncomeProps> = ({
  onBack,
  onSubmit,
  incomeItem,
}) => {
  const { setState, state } = useAppContext();

  const isWalkthrough = state?.run === true;

  const history = useHistory();

  const { trigger, control, setValue, register } =
    useForm<DonationsOrVouchersModel>({
      resolver: yupResolver(donationsOrVouchersSchema),
      mode: 'onChange',
      defaultValues: {
        dateReceived: incomeItem?.dateReceived,
        description: incomeItem?.description,
        amount: incomeItem?.amount.toString(),
        notes: incomeItem?.notes,
        payType: incomeItem?.payTypeId,
      },
    });

  const { isValid, errors } = useFormState({
    control: control,
  });

  const { dateReceived, amount, payType, notes, description } = useWatch({
    control: control,
  });

  const viewTitle = 'Donation';

  const payTypes = useSelector(statementsSelectors.getPayTypes);

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
      id: !!incomeItem ? incomeItem.id : newGuid(),
      dateReceived: dateReceived!,
      amount: !!amount ? Number(moneyInputFormat(amount)) : 0,
      incomeTypeId: IncomeTypeIds.DONATION_ID,
      payTypeId: payType,
      notes: notes,
      description: description,
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

  const payTypesList = payTypes?.map((p) => {
    return {
      label: `${p?.description}`,
      value: p.id,
      disabled: disabled,
    };
  });

  const month = !!dateReceived
    ? getMonthName(new Date(dateReceived).getMonth())
    : '';

  return (
    <BannerWrapper
      title={`Add donations or vouchers`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      showBackground={false}
      onBack={onBack}
      className="p-4"
    >
      <StatementsWrapper />
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="primary" text={viewTitle} />
        {disabled && !!incomeItem && (
          <Alert
            type={'warning'}
            title={
              'You can only view this item. You cannot edit it because you have downloaded the statement, or the statement is more than 60 days old.'
            }
            className="mt-6"
          />
        )}
        <Alert
          type={'info'}
          title={
            'All contributions that you receive for your programme. This could include vouchers, food or educational supplies given to your business. This is usually because of your fundraising efforts.'
          }
          className="mt-4 mb-2"
        />
        <div id="donationsOrVouchers">
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            When did you get this donation/voucher?
          </label>
          <DatePicker
            placeholderText={`Please select a date`}
            wrapperClassName="text-center"
            className="bg-uiBg text-primary mx-auto w-full rounded-md border-none"
            selected={dateReceived ? new Date(dateReceived) : undefined}
            onChange={(date: Date) => {
              date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
              setValue('dateReceived', !!date ? date.toISOString() : '');
              trigger();
            }}
            dateFormat="EEE, dd MMM yyyy"
            minDate={minEditDate}
            maxDate={maxEditDate}
            disabled={(disabled && !!incomeItem) || isWalkthrough}
          />
          {disabled && !incomeItem && (
            <Alert
              type={'warning'}
              title={`You cannot add an item in ${month} because you have already downloaded the ${month} statement.`}
              className="mt-6"
            />
          )}
          <label className={classNames(styles.label, 'mt-4')}>
            {
              'Was the donation an item like groceries or toys, money, or a voucher for a particular shop? '
            }
          </label>
          <ButtonGroup<string>
            type={ButtonGroupTypes.Button}
            options={
              payTypesList?.map((type) => ({
                text: type.label,
                value: type.value ?? '',
                disabled: isWalkthrough,
              })) || []
            }
            onOptionSelected={(value: string | string[]) => {
              if (isWalkthrough || disabled) return;

              setValue('payType', value as string);
            }}
            multiple={false}
            selectedOptions={!!payType ? [payType] : []}
            color="secondary"
            className="mt-2"
          />
        </div>
        <FormInput<DonationsOrVouchersModel>
          label={'How much was the donation worth?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={!disabled ? 'e.g. R 1 000.00' : ''}
          className="mt-4"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
          disabled={disabled}
          value={!!amount ? moneyInputFormat(amount) : undefined}
        />
        {!!payType && payType !== PayTypeIds.MONEY_ID && (
          <FormInput<DonationsOrVouchersModel>
            label={'Short description of the item donated'}
            visible={true}
            nameProp={'description'}
            register={register}
            placeholder={
              !disabled
                ? payType === PayTypeIds.ITEM_ID
                  ? 'e.g. 10 chairs'
                  : 'Grocery voucher for R500'
                : ''
            }
            className="mt-4"
            disabled={disabled}
          />
        )}
        <FormInput<DonationsOrVouchersModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={!disabled ? 'e.g. Food donation from local shop' : ''}
          className="mt-4"
          disabled={disabled}
        />
        {!disabled && (
          <Button
            id="saveDonationsOrVouchers"
            type="filled"
            color="quatenary"
            className={'mx-auto mt-8 w-full rounded-2xl'}
            onClick={() => {
              if (isWalkthrough) {
                setState({ stepIndex: 7 });
                return history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.MONEY,
                });
              }

              sendIncomeUpdate();
            }}
            disabled={(!isValid || disabled) && !isWalkthrough}
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

export default DonationsOrVouchers;
