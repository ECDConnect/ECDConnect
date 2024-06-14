import {
  BannerWrapper,
  Typography,
  renderIcon,
  Button,
  Alert,
  FormInput,
  ImageInput,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './rent.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useState } from 'react';
import {
  ExpensesModel,
  expensesSchema,
} from '@/schemas/expense-statements/expenses';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { lastDayOfMonth, startOfMonth } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddExpenseState } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { BusinessTabItems } from '@/pages/business/business.types';
import { ExpenseTypeIds } from '@ecdlink/core';

export const Rent: React.FC<AddExpenseState> = ({
  onBack,
  onSubmit,
  expenseItem,
}) => {
  const history = useHistory();
  const {
    trigger,
    control,
    setValue: setFormValue,
    register,
  } = useForm<ExpensesModel>({
    resolver: yupResolver(expensesSchema),
    mode: 'onChange',
    defaultValues: !!expenseItem
      ? {
          datePaid: expenseItem?.datePaid,
          photoProof: expenseItem?.photoProof,
          amount: expenseItem?.amount.toString(),
          notes: expenseItem?.notes,
        }
      : undefined,
  });

  const { datePaid, photoProof, amount, notes } = useWatch({
    control: control,
  });

  const { isValid, errors } = useFormState({
    control: control,
  });

  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [registrationFormPhotoUrl, setRegistrationFormPhotoUrl] =
    useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const viewTitle = 'Rent';

  const acceptedFormats = ['jpg', 'jpeg'];

  const setPhotoUrl = (imageUrl: string) => {
    setFormValue('photoProof', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    trigger();
    setPhotoActionBarVisible(false);
  };

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const minEditDate = !!expenseItem
    ? startOfMonth(new Date(expenseItem.datePaid))
    : sixtyDaysAgo;

  const maxEditDate = !!expenseItem
    ? lastDayOfMonth(new Date(expenseItem.datePaid))
    : lastDayOfMonth(new Date());

  const sendIncomeUpdate = async () => {
    setIsLoading(true);

    const expensesInput = {
      id: !!expenseItem ? expenseItem.id : newGuid(),
      datePaid: datePaid!,
      notes: notes,
      amount: amount ? moneyInputFormat(amount) : 0,
      expenseTypeId: ExpenseTypeIds.RENT_EXPENSE_ID,
      photoProof: photoProof,
    };

    onSubmit(expensesInput);

    await history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.MONEY,
    });
    setIsLoading(false);
  };

  return (
    <BannerWrapper
      title={`Add rent`}
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
            'The cost for using your programme venue. This could be a venue you rent for the programme or a share of your home rental if you are running your programme from home.'
          }
          className="mt-4 mb-4"
        />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you pay?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          selected={datePaid ? new Date(datePaid) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setFormValue('datePaid', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={minEditDate}
          maxDate={maxEditDate}
        />
        <FormInput<ExpensesModel>
          label={'How much did you pay?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={'e.g. R 500.00'}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
        />
        <FormInput<ExpensesModel>
          label={'Add a description or note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={'e.g. Paid for two months'}
          className="mt-2"
        />
        <ImageInput<ExpensesModel>
          acceptedFormats={acceptedFormats}
          label={`Upload a photo of invoice or receipt`}
          subLabel={'Optional'}
          nameProp="photoProof"
          icon="CameraIcon"
          iconContainerColor={'secondary'}
          className={'py-4'}
          currentImageString={registrationFormPhotoUrl}
          register={register}
          overrideOnClick={() => setPhotoActionBarVisible(true)}
          onValueChange={(imageString: string) => {
            setFormValue('photoProof', imageString);
            trigger();
          }}
        ></ImageInput>
        <Dialog
          visible={photoActionBarVisible}
          position={DialogPosition.Bottom}
          stretch
        >
          <PhotoPrompt
            title="Expense invoice or receipt"
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
            onDelete={
              registrationFormPhotoUrl
                ? () => {
                    setFormValue('photoProof', '');
                    setRegistrationFormPhotoUrl(undefined);
                    setPhotoActionBarVisible(false);
                  }
                : undefined
            }
          ></PhotoPrompt>
        </Dialog>
        <Button
          type="filled"
          color="quatenary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={sendIncomeUpdate}
          disabled={!isValid}
          isLoading={isLoading}
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

export default Rent;
