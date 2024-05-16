import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useFormState, useForm } from 'react-hook-form';
import {
  ChildLearningSupportFormModel,
  childLearningSupportFormSchema,
} from '@schemas/classroom/child-progress-observations/child-learning-support-form';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { ChildLearningSupportFormProps } from './child-learning-support-form.types';

export const ChildLearningSupportForm: React.FC<
  ChildLearningSupportFormProps
> = ({ childLearningSupportForm, childId, helpingWithSkillId, onSubmit }) => {
  const currentChild = useSelector(childrenSelectors.getChildById(childId));

  const helpingWithSkill = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillById(helpingWithSkillId)
  );

  const {
    getValues: getChildLearningSupportFormValues,
    register: childLearningSupportFormRegister,
    control: childLearningSupportFormControl,
  } = useForm<ChildLearningSupportFormModel>({
    resolver: yupResolver(childLearningSupportFormSchema),
    mode: 'onChange',
    defaultValues: childLearningSupportForm,
  });

  const { isValid } = useFormState({
    control: childLearningSupportFormControl,
  });

  const handleFormSubmit = (exit: boolean) => {
    if (exit) {
      onSubmit(getChildLearningSupportFormValues(), true);
    } else if (isValid) {
      onSubmit(getChildLearningSupportFormValues(), false);
    }
  };

  return (
    <div className={'bg-white px-4 pt-2'}>
      <Typography
        type={'h2'}
        text={`Supporting ${currentChild?.user?.firstName}'s learning`}
        color={'textDark'}
      />
      <div className="mt-2">
        <Typography
          type={'h4'}
          text={`What will you do to support ${currentChild?.user?.firstName} in developing this skill:`}
          color={'textDark'}
        />
      </div>

      <div className="mt-1">
        <Typography
          type={'body'}
          text={helpingWithSkill?.name ?? ''}
          color={'textMid'}
          weight={'bold'}
        />
      </div>

      <FormInput<ChildLearningSupportFormModel>
        textInputType="textarea"
        register={childLearningSupportFormRegister}
        nameProp={'learningSupport'}
        placeholder={
          'E.g. Group to share ball, take turns to kick ball, score goals, catch, throw'
        }
      />
      <div className={'py-4'}></div>
      <Button
        onClick={() => handleFormSubmit(false)}
        className="mb-4 w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
        <Typography
          type="h6"
          className="ml-2"
          text="Save & continue"
          color="white"
        />
      </Button>
      <Button
        onClick={() => handleFormSubmit(true)}
        className="w-full"
        size="small"
        color="primary"
        type="outlined"
        disabled={false}
      >
        {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
        <Typography
          type="h6"
          className="ml-2"
          text="Save & exit"
          color="primary"
        />
      </Button>
    </div>
  );
};
