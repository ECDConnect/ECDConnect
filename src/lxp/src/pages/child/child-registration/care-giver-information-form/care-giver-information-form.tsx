import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Dropdown,
  FormInput,
  Typography,
  classNames,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './care-giver-information-form.styles';
import {
  CareGiverInformationFormModel,
  careGiverInformationFormSchema,
} from '@schemas/child/child-registration/care-giver-information-form';
import { CareGiverInformationFormProps } from './care-giver-information-form.types';

export const CareGiverInformationForm: React.FC<
  CareGiverInformationFormProps
> = ({ careGiverInformation, childName, onSubmit }) => {
  const relations = useSelector(staticDataSelectors.getRelations);
  const [idFieldVisible, setIdFieldVisible] = useState(true);

  const {
    getValues: getCareGiverInformationFormValues,
    setValue: setCareGiverInformationFormValue,
    register: CareGiverInformationFormRegister,
    formState: careGiverInformationFormState,
  } = useForm<CareGiverInformationFormModel>({
    resolver: yupResolver(careGiverInformationFormSchema),
    mode: 'onChange',
    defaultValues: { ...careGiverInformation, preferId: true },
  });

  const { isValid } = careGiverInformationFormState;

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getCareGiverInformationFormValues());
    }
  };

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setCareGiverInformationFormValue(
      flag ? 'careGiverPassportField' : 'careGiverIdField',
      '',
      {
        shouldValidate: true,
      }
    );
    setCareGiverInformationFormValue('preferId', flag, {
      shouldValidate: true,
    });
    setIdFieldVisible(flag);
  };

  return (
    <div className={styles.wrapper}>
      <Typography type={'h1'} text={'Primary caregiver'} color={'primary'} />
      <Typography type={'h2'} text={'Details'} color={'textMid'} />

      <Dropdown
        placeholder={'Select relationship'}
        list={
          (relations &&
            relations.map((relation) => {
              return { label: relation.description, value: relation.id };
            })) ||
          []
        }
        fullWidth
        fillType="clear"
        label={`Relationship to ${childName || 'child'}?`}
        className={'mt-3'}
        onChange={(item: any) => {
          setCareGiverInformationFormValue('relationId', item, {
            shouldValidate: true,
          });
        }}
      />
      <FormInput<CareGiverInformationFormModel>
        label={'First name'}
        className={'mt-4'}
        register={CareGiverInformationFormRegister}
        nameProp={'firstname'}
        error={careGiverInformationFormState.errors['firstname']}
        placeholder={'First name'}
      />
      <FormInput<CareGiverInformationFormModel>
        label={'Surname'}
        className={'mt-3'}
        register={CareGiverInformationFormRegister}
        nameProp={'surname'}
        error={careGiverInformationFormState.errors['surname']}
        placeholder={'Surname/family name'}
      />
      {idFieldVisible && (
        <FormInput<CareGiverInformationFormModel>
          label={"Caregiver's ID number"}
          className={'mt-4'}
          nameProp={'careGiverIdField'}
          register={CareGiverInformationFormRegister}
          error={careGiverInformationFormState.errors['careGiverIdField']}
          placeholder={'E.g. 190101 0000 000'}
        />
      )}
      {!idFieldVisible && (
        <FormInput<CareGiverInformationFormModel>
          label={'Passport number'}
          className={'mt-4'}
          visible={true}
          nameProp={'careGiverPassportField'}
          error={careGiverInformationFormState.errors['careGiverPassportField']}
          register={CareGiverInformationFormRegister}
        />
      )}
      {!idFieldVisible && (
        <Button
          className={'mt-3 mb-2'}
          type="outlined"
          color="primary"
          background={'transparent'}
          size="small"
          onClick={() => toggleIdAndpassport(idFieldVisible)}
        >
          <Typography
            type="small"
            color="primary"
            text={'Enter ID number instead'}
          ></Typography>
        </Button>
      )}
      {idFieldVisible && (
        <Button
          className={'mt-3 mb-2'}
          type="outlined"
          color="primary"
          size="small"
          background={'transparent'}
          onClick={() => toggleIdAndpassport(idFieldVisible)}
        >
          <Typography
            type="small"
            color="primary"
            text={'Enter passport number instead'}
          ></Typography>
        </Button>
      )}
      <FormInput<CareGiverInformationFormModel>
        label={'Cellphone number'}
        className={'mt-1'}
        register={CareGiverInformationFormRegister}
        nameProp={'phoneNumber'}
        error={careGiverInformationFormState.errors['phoneNumber']}
        placeholder={'E.g. 082 345 6789'}
      />
      <div className={'py-4'}>
        <Divider></Divider>
      </div>
      <Button
        onClick={handleFormSubmit}
        className="w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
        <Typography type="h6" className="ml-2" text="Next" color="white" />
      </Button>
    </div>
  );
};
