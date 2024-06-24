import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dropdown,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
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

  return (
    <div className={styles.wrapper}>
      <Typography type={'h2'} text={'Primary caregiver'} color={'primary'} />
      <Typography type={'h4'} text={'Details'} color={'textMid'} />

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
        selectedValue={getCareGiverInformationFormValues().relationId}
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
        className={'mt-4'}
        register={CareGiverInformationFormRegister}
        nameProp={'surname'}
        error={careGiverInformationFormState.errors['surname']}
        placeholder={'Surname/family name'}
      />
      <FormInput<CareGiverInformationFormModel>
        label={'Cellphone number'}
        className={'mt-4'}
        register={CareGiverInformationFormRegister}
        nameProp={'phoneNumber'}
        error={careGiverInformationFormState.errors['phoneNumber']}
        placeholder={'E.g. 082 345 6789'}
      />
      <Button
        onClick={handleFormSubmit}
        className="mt-auto w-full"
        size="small"
        color="quatenary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
        <Typography type="h6" className="ml-2" text="Next" color="white" />
      </Button>
    </div>
  );
};
