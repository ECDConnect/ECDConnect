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
  IMAGE_WIDTH,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import * as styles from './learning-materials.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useState } from 'react';
import {
  ExpensesModel,
  expensesSchema,
} from '@/schemas/expense-statements/expenses';
import { moneyInputFormat } from '@/utils/statements/statements-utils';
import { isBefore, lastDayOfMonth, startOfMonth } from 'date-fns';
import { AddExpenseState } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { ExpenseTypeIds } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';

export const LearningMaterials: React.FC<AddExpenseState> = ({
  onBack,
  onSubmit,
  expenseItem,
}) => {
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

  const acceptedFormats = ['jpg', 'jpeg'];

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const minEditDate = !!expenseItem
    ? startOfMonth(new Date(expenseItem.datePaid))
    : sixtyDaysAgo;

  const maxEditDate = !!expenseItem
    ? lastDayOfMonth(new Date(expenseItem.datePaid))
    : lastDayOfMonth(new Date());

  const setPhotoUrl = (imageUrl: string) => {
    setFormValue('photoProof', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    trigger();
    setPhotoActionBarVisible(false);
  };

  const sendExpenseUpdate = async () => {
    const expensesInput = {
      id: !!expenseItem ? expenseItem.id : newGuid(),
      datePaid: datePaid!,
      notes: notes,
      amount: !!amount ? Number(moneyInputFormat(amount)) : 0,
      expenseTypeId: ExpenseTypeIds.LEARNING_MATERIALS_ID,
      photoProof: photoProof,
    };

    onSubmit(expensesInput);
  };

  const statementDate = !!datePaid ? new Date(datePaid) : new Date();
  const statement = useSelector(
    statementsSelectors.getStatementForMonth(
      statementDate.getFullYear(),
      statementDate.getMonth() + 1
    )
  );

  const disabled =
    (datePaid && !!statement?.downloaded) ||
    (!!expenseItem && isBefore(new Date(expenseItem.datePaid), sixtyDaysAgo));

  const month = !!datePaid ? getMonthName(new Date(datePaid).getMonth()) : '';

  return (
    <BannerWrapper
      title={`Add learning materials`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      showBackground={false}
      onBack={onBack}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="primary" text="Learning Materials" />
        {disabled && !!expenseItem && (
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
            'Includes costs of printing and buying books, toys, crayons, or any other supplies used for education activities.'
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
            trigger();
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={minEditDate}
          maxDate={maxEditDate}
          disabled={disabled && !!expenseItem}
        />
        {disabled && !expenseItem && (
          <Alert
            type={'warning'}
            title={`You cannot add an item in ${month} because you have already downloaded the ${month} statement.`}
            className="mt-6"
          />
        )}
        <FormInput<ExpensesModel>
          label={'How much did you pay?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={!disabled ? 'e.g. R 150.00' : ''}
          className="mt-2"
          type={'text'}
          textInputType={'moneyInput'}
          prefixIcon={!!amount}
          error={errors['amount']}
          disabled={disabled}
          value={!!amount ? moneyInputFormat(amount) : undefined}
        />
        <FormInput<ExpensesModel>
          label={'Add a description or note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'notes'}
          register={register}
          placeholder={!disabled ? 'e.g. Story books' : ''}
          className="mt-2"
          disabled={disabled}
        />
        <ImageInput<ExpensesModel>
          acceptedFormats={acceptedFormats}
          resolutionLimit={IMAGE_WIDTH}
          label={`Upload a photo of invoice or receipt`}
          subLabel={'Optional'}
          nameProp="photoProof"
          icon="CameraIcon"
          iconContainerColor={'secondary'}
          className={'py-4'}
          currentImageString={registrationFormPhotoUrl}
          register={register}
          overrideOnClick={() => {
            if (!disabled) {
              setPhotoActionBarVisible(true);
            }
          }}
          onValueChange={(imageString: string) => {
            setFormValue('photoProof', imageString);
            trigger();
          }}
          disabled={disabled}
        />
        <Dialog
          visible={photoActionBarVisible}
          position={DialogPosition.Bottom}
          stretch
        >
          <PhotoPrompt
            title="Expense invoice or receipt"
            resolutionLimit={IMAGE_WIDTH}
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
          />
        </Dialog>
        {!disabled && (
          <Button
            type="filled"
            color="quatenary"
            className={'mx-auto mt-8 w-full rounded-2xl'}
            onClick={sendExpenseUpdate}
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

export default LearningMaterials;
