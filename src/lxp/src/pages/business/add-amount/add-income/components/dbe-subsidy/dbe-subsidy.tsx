import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  FormInput,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './dbe-subsidy.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { lastDayOfMonth, startOfMonth } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddIncomeProps } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { BusinessTabItems } from '@/pages/business/business.types';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';
import {
  DbeSubsidyModel,
  dbeSubsidySchema,
} from '@/schemas/income-statements/dbe-subsidy';

export const DbeSubsidy: React.FC<AddIncomeProps> = ({
  onBack,
  onSubmit,
  incomeItem,
}) => {
  const history = useHistory();

  const viewTitle = 'DBE Subsidy';

  const {
    control,
    setValue: setPreschoolFeesValue,
    register,
  } = useForm<DbeSubsidyModel>({
    resolver: yupResolver(dbeSubsidySchema),
    mode: 'onChange',
    defaultValues: {
      dateReceived: incomeItem?.dateReceived,
      numberOfChildrenSupported:
        incomeItem?.numberOfChildrenCovered?.toString(),
      amount: incomeItem?.amount.toString(),
      notes: incomeItem?.notes,
    },
  });

  const { dateReceived, numberOfChildrenSupported, amount, notes } = useWatch({
    control: control,
  });

  const { isValid, errors } = useFormState({
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
      id: !!incomeItem ? incomeItem.id : newGuid(),
      dateReceived: dateReceived!,
      amount: moneyInputFormat(amount!),
      numberOfChildrenCovered: Number(numberOfChildrenSupported),
      incomeTypeId: IncomeTypeIds.DBE_SUBSIDY_ID,
      notes: notes,
    };

    onSubmit(incomeInput);

    await history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.MONEY,
    });
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
      onBack={onBack}
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
          selected={dateReceived ? new Date(dateReceived) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setPreschoolFeesValue(
              'dateReceived',
              date ? date.toISOString() : ''
            );
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={minEditDate}
          maxDate={maxEditDate}
        />
        <FormInput<DbeSubsidyModel>
          label={'How many children do you receive this amount for?'}
          visible={true}
          nameProp={'numberOfChildrenSupported'}
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
        <FormInput<DbeSubsidyModel>
          label={'How much did you receive from the DBE subsidy?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={'e.g. R 1 000.00'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
        />
        <FormInput<DbeSubsidyModel>
          label={'Add a note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={'e.g. Paid 2 days late'}
          className="mt-2"
        />
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={handleSaveStartupSupportValues}
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

export default DbeSubsidy;
