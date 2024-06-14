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
import { useForm, useFormState, useWatch } from 'react-hook-form';
import {
  OtherIncomeModel,
  otherIncomeSchema,
} from '@/schemas/income-statements/other-income';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { lastDayOfMonth, startOfMonth } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddIncomeProps } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { BusinessTabItems } from '@/pages/business/business.types';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';

export const OtherIncome: React.FC<AddIncomeProps> = ({
  onBack,
  onSubmit,
  incomeItem,
}) => {
  const history = useHistory();

  const viewTitle = 'Other';

  const {
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
      amount: moneyInputFormat(amount!),
      incomeTypeId: IncomeTypeIds.OTHER_INCOME_ID,
    };

    onSubmit(incomeInput);

    await history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.MONEY,
    });
  };

  return (
    <BannerWrapper
      title={`Other income`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={onBack}
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
          selected={dateReceived ? new Date(dateReceived) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setValue('dateReceived', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={minEditDate}
          maxDate={maxEditDate}
        />
        <FormInput<OtherIncomeModel>
          label={'How much do you get from this income type?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={'e.g. R 50.00'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
        />
        <FormInput<OtherIncomeModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={'e.g. Small grant from local shop'}
          className="mt-2"
          error={errors['notes']}
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={() => {
            sendIncomeUpdate();
          }}
          disabled={!isValid}
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
