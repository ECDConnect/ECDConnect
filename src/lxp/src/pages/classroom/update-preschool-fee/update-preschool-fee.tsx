import {
  Alert,
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { useSelector } from 'react-redux';
import { classroomsSelectors, classroomsThunkActions } from '@/store/classroom';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { UpdatePreschoolFeeModel } from '@/schemas/classroom/update-preschool-fee/update-preschool-fee';
import { preschoolFeesSchema } from '@/schemas/income-statements/preschool-fees';
import { yupResolver } from '@hookform/resolvers/yup';
import { moneyInputFormat } from '@/utils/statements/statements-utils';

export const UpdatePreschoolFee: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const location = useLocation<{ fromUpdateReminder: boolean }>();
  const fromUpdateReminder = !!location?.state
    ? location?.state.fromUpdateReminder
    : false;

  const [askForFee, setAskForFee] = useState<boolean | undefined>(
    classroom?.preschoolFeeAmount === null
      ? undefined
      : !!classroom?.preschoolFeeAmount
  );
  const [changeFee, setChangeFee] = useState<boolean | undefined>(undefined);

  const { register: formRegister, control: formControl } =
    useForm<UpdatePreschoolFeeModel>({
      resolver: yupResolver(preschoolFeesSchema),
      mode: 'onChange',
      defaultValues: {
        amount: !!classroom?.preschoolFeeAmount
          ? `${classroom?.preschoolFeeAmount}`
          : undefined,
      },
    });

  const { amount } = useWatch({
    control: formControl,
  });

  const onSubmit = async () => {
    await appDispatch(
      classroomsThunkActions.updatePreschoolFee({
        classroomId: classroom?.id as string,
        amount: askForFee ? moneyInputFormat(amount!) : undefined,
      })
    );
    history.goBack();
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Monthly preschool fee'}
      color={'primary'}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
      className="p-4"
    >
      <Typography type={'h1'} color="black" text={'Monthly preschool fee'} />
      <Alert
        type="info"
        title={'Update the preschool fee each year'}
        list={[
          'During child registration caregivers will be asked if they can pay the fee.',
          'If the caregiver cannot afford to pay, you may choose to reduce your fee or to allow them to contribut in other ways, such as giving items like food, or volunteering their time.',
        ]}
        className={'mt-4 w-11/12'}
      />
      {/* Only show if we haven't updated the fee this year and we did have a fee last year */}
      {fromUpdateReminder && (
        <>
          <Typography
            className={'mt-4'}
            type={'h2'}
            color="black"
            text={`Last year, you charged caregivers R${
              classroom?.preschoolFeeAmount || 0
            }. Will you be changing this amount for the ${new Date().getFullYear()} school year?`}
          />
          <ButtonGroup
            options={[
              { text: 'Yes', value: true },
              { text: 'No', value: false },
            ]}
            onOptionSelected={(value: boolean | boolean[]) => {
              const update = value as boolean;
              setChangeFee(update);
            }}
            selectedOptions={changeFee}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'mt-4 w-full'}
            multiple={false}
          />
        </>
      )}
      {(!fromUpdateReminder || changeFee) && (
        <>
          <Typography
            className={'mt-4'}
            type={'h2'}
            color="black"
            text={`Will you ask caregivers to pay a monthly fee at ${classroom?.name}`}
          />
          <ButtonGroup
            options={[
              { text: 'Yes', value: true },
              { text: 'No', value: false },
            ]}
            onOptionSelected={(value: boolean | boolean[]) => {
              const setFee = value as boolean;
              setAskForFee(setFee);
            }}
            selectedOptions={askForFee}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'mt-4 w-full'}
            multiple={false}
          />
          {!!askForFee && (
            <FormInput<UpdatePreschoolFeeModel>
              label={'How much will you ask the caregivers to pay each month?'}
              visible={true}
              nameProp={'amount'}
              register={formRegister}
              placeholder={'Add amount'}
              className="mt-4"
              type={'text'}
              textInputType={'moneyInput'}
              prefixIcon={true}
            />
          )}
        </>
      )}
      <Button
        type="filled"
        color="primary"
        className={'mx-auto mt-8 w-full rounded-2xl'}
        onClick={onSubmit}
        disabled={askForFee && !amount}
        id="savePreschoolFee"
      >
        {renderIcon(
          'SaveIcon',
          'h-4 w-4 text-white mr-2 bg-primary rounded-full'
        )}
        <Typography
          type="help"
          className="mr-2"
          color="white"
          text={'Save'}
        ></Typography>
      </Button>
    </BannerWrapper>
  );
};

export default UpdatePreschoolFee;
