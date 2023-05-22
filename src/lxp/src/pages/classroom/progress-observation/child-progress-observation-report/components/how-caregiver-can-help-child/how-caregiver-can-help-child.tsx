import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import {
  CaregiverCanHelpChildWithFormModel,
  caregiverCanHelpChildWithFormSchema,
} from '@schemas/classroom/child-progress-observations/how-caregiver-can-help-child-form';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { useEffect } from 'react';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { HowCaregiverCanHelpChildProps } from './how-caregiver-can-help-child.types';
import ObservationCategoryCard from '../../../components/observation-category-card/observation-category-card';
import { useForm, useFormState } from 'react-hook-form';
import { getCategoryFromCurrentReport } from '@utils/child/child-progress-report.utils';

export const CaregiverCanHelpChildWith: React.FC<
  HowCaregiverCanHelpChildProps
> = ({ childId, onSubmit }) => {
  const { currentReport } = useChildProgressObservation(childId);
  const allCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );

  const {
    getValues: getFormValue,
    setValue: setFormValue,
    register: formRegister,
    control: formControl,
  } = useForm<CaregiverCanHelpChildWithFormModel>({
    resolver: yupResolver(caregiverCanHelpChildWithFormSchema),
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: formControl });

  const handleFormSubmit = (formValue: CaregiverCanHelpChildWithFormModel) => {
    onSubmit(formValue);
  };

  useEffect(() => {
    if (currentReport && currentReport.howCanCaregiverHelpChild) {
      setFormValue(
        'howCanCaregiverHelpChild',
        currentReport.howCanCaregiverHelpChild,
        {
          shouldValidate: true,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  return (
    <div className={'flex h-full w-full flex-col px-4'}>
      <Typography
        type={'h1'}
        color={'primary'}
        text={'Share more detail for the caregiver report'}
      />
      <FormInput
        type={'text'}
        textInputType={'textarea'}
        register={formRegister}
        nameProp={'howCanCaregiverHelpChild'}
        label={`How can ${childUser?.firstName}’s caregiver help ${childUser?.firstName} to learn and grow?`}
        placeholder={`E.g. Asking them how they are feeling every morning and asking him to name items in and around the house.`}
      />

      <Typography
        type={'body'}
        color={'black'}
        text={`Your plans for supporting ${childUser?.firstName}`}
        className={'mt-4'}
      />

      {currentReport &&
        currentReport.categories &&
        allCategories.map((cat) => {
          const categoryFromReport = getCategoryFromCurrentReport(
            cat.id,
            currentReport
          );
          return (
            <ObservationCategoryCard
              key={`completed-${cat.id}`}
              className={'mt-4'}
              categoryImageUrl={cat.imageUrl}
              categoryName={cat.name}
              isCompetentWithCategory={
                [
                  ProgressTrackingLevels.LevelThree,
                  ProgressTrackingLevels.LevelTwo,
                ].includes(categoryFromReport?.achievedLevelId ?? 0) &&
                !categoryFromReport?.supportingTask
              }
              categoryColour={cat.color}
              childName={`${childUser?.firstName}`}
              helpingSkillId={categoryFromReport?.supportingTask?.taskId || 0}
              toDoNote={categoryFromReport?.supportingTask?.todoText || ''}
            />
          );
        })}

      <Divider className={'my-4'} />

      <Button
        onClick={() => {
          handleFormSubmit(getFormValue());
        }}
        className="w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', 'h-5 w-5 text-white')}
        <Typography type="h6" className="ml-2" text="Next" color="white" />
      </Button>
    </div>
  );
};
