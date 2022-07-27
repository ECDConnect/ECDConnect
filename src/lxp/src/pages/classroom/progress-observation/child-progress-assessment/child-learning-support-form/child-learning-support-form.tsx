import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  FormInput,
  Typography,
  classNames,
} from '@ecdlink/ui';
import { useFormState } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  ChildLearningSupportFormModel,
  childLearningSupportFormSchema,
} from '@schemas/classroom/child-progress-observations/child-learning-support-form';
import { renderIcon } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { ChildLearningSupportFormProps } from './child-learning-support-form.types';

export const ChildLearningSupportForm: React.FC<
  ChildLearningSupportFormProps
> = ({ childLearningSupportForm, childId, helpingWithSkillId, onSubmit }) => {
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );

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

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildLearningSupportFormValues());
    }
  };

  return (
    <div className={'bg-uiBg pt-2 px-4'}>
      <Typography
        type={'h1'}
        text={`Supporting ${currentChildUser?.firstName}'s learning`}
        color={'primary'}
      />
      <div className="mt-2">
        <Typography
          type={'body'}
          text={`What will you do to support ${currentChildUser?.firstName} in developing this skill:`}
          color={'textMid'}
          weight={'bold'}
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
        placeholder={'E.g. Group to...'}
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
