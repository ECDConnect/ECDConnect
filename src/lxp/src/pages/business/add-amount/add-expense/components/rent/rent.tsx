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
import { useForm, useWatch } from 'react-hook-form';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useMemo, useState } from 'react';
import {
  ExpensesModel,
  expensesSchema,
} from '@/schemas/expense-statements/expenses';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { statementsSelectors } from '@/store/statements';
import {
  isNumber,
  moneyInputFormat,
} from '@/utils/statements/statements-utils';
import { getDate, lastDayOfMonth, startOfMonth } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddExpenseState } from '../../../add-amount.types';
import { newGuid } from '@/utils/common/uuid.utils';

export const Rent: React.FC<AddExpenseState> = ({ setType, onSubmit }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const {
    trigger,
    control,
    setValue: setFormValue,
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

  const expensesTypes = useSelector(statementsSelectors.getExpensesTypes);
  const viewTitle = 'Rent';
  const expensesTypeValue = expensesTypes.find(
    (item) => item.description === viewTitle
  );
  const isNum = isNumber(amount!);
  const disabled = useMemo(() => {
    return !date || !amount;
  }, [amount, date]);
  const acceptedFormats = ['jpg', 'jpeg'];

  const setPhotoUrl = (imageUrl: string) => {
    setFormValue('expenseInvoice', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    trigger();
    setPhotoActionBarVisible(false);
  };

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
    setIsLoading(true);

    const expensesInput = {
      Id: newGuid(),
      IsActive: true,
      UserId: userAuth?.id,
      Submitted: false,
      DatePaid: date,
      Notes: note,
      Amount: amount ? moneyInputFormat(amount) : 0,
      ExpenseTypeId: expensesTypeValue?.id,
      PhotoProof: expenseInvoice,
    };

    onSubmit(expensesInput);

    await history.push(ROUTES.BUSINESS);
    setIsLoading(false);
  };

  return (
    <BannerWrapper
      title={`Add rent`}
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
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
            setFormValue('date', date ? date.toISOString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={
            todayDateNumber <= 8 ? firstDateOfPreviousMonth! : firstDateOfMonth!
          }
          maxDate={lastDateOfMonth}
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
        />
        <FormInput<ExpensesModel>
          label={'Add a description or note'}
          subLabel={'Optional'}
          visible={true}
          nameProp={'note'}
          register={register}
          placeholder={'e.g. Paid for two months'}
          className="mt-2"
        />
        <ImageInput<ExpensesModel>
          acceptedFormats={acceptedFormats}
          label={`Upload a photo of invoice or receipt`}
          subLabel={'Optional'}
          nameProp="expenseInvoice"
          icon="CameraIcon"
          iconContainerColor={'tertiary'}
          className={'py-4'}
          currentImageString={registrationFormPhotoUrl}
          register={register}
          overrideOnClick={() => setPhotoActionBarVisible(true)}
          onValueChange={(imageString: string) => {
            setFormValue('expenseInvoice', imageString);
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
                    setFormValue('expenseInvoice', '');
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
          disabled={disabled || !isNum}
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
