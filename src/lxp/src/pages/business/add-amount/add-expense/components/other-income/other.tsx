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
import * as styles from './other.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { AddIncomeState } from './other.types';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useState } from 'react';
import {
  ExpensesModel,
  expensesSchema,
} from '@/schemas/expense-statements/expenses';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import { newGuid } from '@/utils/common/uuid.utils';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { statementsSelectors } from '@/store/statements';

export const Other: React.FC<AddIncomeState> = ({ setType }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const {
    trigger,
    control,
    setValue: setRentValue,
    register,
  } = useForm<ExpensesModel>({
    resolver: yupResolver(expensesSchema),
    mode: 'onChange',
  });

  const {
    date: selectedDate,
    date,
    expenseInvoice,
    amount,
    note,
  } = useWatch({
    control: control,
  });
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [registrationFormPhotoUrl, setRegistrationFormPhotoUrl] =
    useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const disabled = !date || !amount;
  const acceptedFormats = ['jpg', 'jpeg'];
  const expensesTypes = useSelector(statementsSelectors.getExpensesTypes);
  const viewTitle = 'Other';
  const expensesTypeValue = expensesTypes.find(
    (item) => item.description === viewTitle
  );

  const setPhotoUrl = (imageUrl: string) => {
    setRentValue('expenseInvoice', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    trigger();
    setPhotoActionBarVisible(false);
  };

  const sendIncomeUpdate = async () => {
    const incomeId = newGuid();
    setIsLoading(true);

    await new ExpensesStatementsService(
      userAuth?.auth_token!
    ).UpdateStatementsIncome(incomeId, {
      IsActive: true,
      UserId: userAuth?.id,
      Submitted: false,
      DatePaid: date,
      Notes: note,
      Amount: Number(amount),
      ExpenseTypeId: expensesTypeValue?.id,
      PhotoProof: expenseInvoice,
    });

    setIsLoading(false);
    await setType('');
  };

  return (
    <BannerWrapper
      title={`Add another expense`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => setType('')}
      className="p-4"
    >
      <div className="mb-3 w-full justify-center">
        <Typography type="h2" color="textMid" text={'Other expense'} />
        <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
          When did you pay?
        </label>
        <DatePicker
          placeholderText={`Please select a date`}
          wrapperClassName="text-center"
          className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            setRentValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
        />
        <FormInput<ExpensesModel>
          label={'How much did you pay?'}
          visible={true}
          nameProp={'amount'}
          register={register}
          placeholder={'e.g. R 50.00'}
          className="mt-2"
          type={'number'}
        />
        <FormInput<ExpensesModel>
          label={'Add a description or note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Small grant from local shop'}
          className="mt-2"
        />
        <ImageInput<ExpensesModel>
          acceptedFormats={acceptedFormats}
          label={`Upload a photo of invoice or receipt`}
          subLabel={'Optional'}
          nameProp="expenseInvoice"
          icon="CameraIcon"
          className={'py-4'}
          currentImageString={registrationFormPhotoUrl}
          register={register}
          overrideOnClick={() => setPhotoActionBarVisible(true)}
          onValueChange={(imageString: string) => {
            setRentValue('expenseInvoice', imageString);
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
                    setRentValue('expenseInvoice', '');
                    setRegistrationFormPhotoUrl(undefined);
                    setPhotoActionBarVisible(false);
                  }
                : undefined
            }
          ></PhotoPrompt>
        </Dialog>
        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-8 w-full rounded-2xl'}
          onClick={sendIncomeUpdate}
          disabled={disabled}
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

export default Other;
