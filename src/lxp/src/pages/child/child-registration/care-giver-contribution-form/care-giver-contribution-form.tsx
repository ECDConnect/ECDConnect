import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  classNames,
  Divider,
  renderIcon,
  Typography,
  Alert,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
  CareGiverContributionFormModel,
  careGiverContributionFormSchema,
} from '@schemas/child/child-registration/care-giver-contribution-form';
import * as styles from './care-giver-contribution-form.styles';
import { CareGiverContributionFormProps } from './care-giver-contribution-form.types';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';

export const CareGiverContributionForm: React.FC<
  CareGiverContributionFormProps
> = ({ careGiverContributionForm, onSubmit, variation, childDetails }) => {
  const classroom = useSelector(classroomsSelectors.getClassroom);

  const [commitedToContributing, setCommitedToContributing] =
    useState<boolean>();

  const {
    getValues: getCareGiverContributionFormValues,
    setValue: setCareGiverContributionFormValue,
    control: careGiverContributionFormControl,
  } = useForm<CareGiverContributionFormModel>({
    resolver: yupResolver(careGiverContributionFormSchema),
    mode: 'onBlur',
    defaultValues: careGiverContributionForm,
  });

  useEffect(() => {
    setCareGiverContributionFormValue('commitedToContributing', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (careGiverContributionForm) {
      setCommitedToContributing(
        careGiverContributionForm.commitedToContributing
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careGiverContributionForm]);

  const { isValid } = useFormState({
    control: careGiverContributionFormControl,
  });

  const commitToContributing: ButtonGroupOption<boolean>[] = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getCareGiverContributionFormValues());
    }
  };

  return (
    <div className={'bg-uiBg px-4 pt-2 pb-4'}>
      <Typography type={'h1'} text={'Primary caregiver'} color={'primary'} />
      <Typography
        type={'h2'}
        text={'Contribution to the programme'}
        color={'textMid'}
      />
      <div>
        {variation === 'practitioner' && (
          <PractitionerForm amount={classroom?.preschoolFeeAmount || 0} />
        )}
        {variation === 'caregiver' && (
          <CaregiverForm
            amount={classroom?.preschoolFeeAmount || 0}
            playgroupName={childDetails?.child?.groupName || ''}
          />
        )}
        <div className={'mt-2'}>
          <ButtonGroup
            options={commitToContributing}
            onOptionSelected={(value: boolean | boolean[]) => {
              setCareGiverContributionFormValue(
                'commitedToContributing',
                value as boolean
              );
              setCommitedToContributing(value as boolean);
            }}
            selectedOptions={commitedToContributing}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
            multiple={false}
          />
        </div>
        {variation === 'caregiver' && commitedToContributing === false && (
          <Alert
            type="info"
            message={`
          Please discuss this with ${childDetails?.practitoner?.firstname}. In some cases, practitioners are able to make alternative arrangements.`}
          />
        )}
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
    </div>
  );
};

const PractitionerForm: React.FC<{ amount: number }> = ({ amount }) => {
  return (
    <>
      <label className={classNames(styles.label, 'mt-4')}>
        {`Did the caregiver commit to contributing R${amount} to the programme each month?`}
      </label>
    </>
  );
};

const CaregiverForm: React.FC<{ playgroupName: string; amount: number }> = ({
  playgroupName,
  amount,
}) => {
  return (
    <>
      <Typography
        text="Caregivers need to contribute money to the running of the programme (expenses can include rent, food and learning materials for example)."
        type="unspecified"
        fontSize="14"
      />
      <Typography
        className="mt-4"
        text={`Do you commit to contributing a monthly amount of R${amount} towards ${playgroupName}?`}
        type="unspecified"
        fontSize="14"
      />
    </>
  );
};
