import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  classNames,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
  CareGiverReferencePanelFormModel,
  careGiverReferencePanelFormSchema,
} from '@schemas/child/child-registration/care-giver-reference-panel-form';
import * as styles from './care-giver-reference-panel-form.styles';
import { CareGiverReferencePanelFormProps } from './care-giver-reference-panel-form.types';

export const CareGiverReferencePanelForm: React.FC<
  CareGiverReferencePanelFormProps
> = ({ careGiverReferencePanelForm, variation, isLoading, onSubmit }) => {
  const [joinReferencePanel, setJoinReferencePanel] = useState<boolean>();

  const {
    getValues: getCareGiverContributionFormValues,
    setValue: setCareGiverContributionFormValue,
    control: careGiverContributionFormControl,
    trigger: careGiverContributionFormTrigger,
  } = useForm<CareGiverReferencePanelFormModel>({
    resolver: yupResolver(careGiverReferencePanelFormSchema),
    mode: 'onBlur',
    defaultValues: careGiverReferencePanelForm,
  });

  const { isValid } = useFormState({
    control: careGiverContributionFormControl,
  });

  const joiningReferencePanel: ButtonGroupOption<boolean>[] = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getCareGiverContributionFormValues());
    }
  };

  return (
    <div className={'h-full bg-white px-4 pt-2 pb-4'}>
      <Typography
        type={'h1'}
        text={'Caregiver reference panel'}
        color={'primary'}
      />
      <div>
        <label className={classNames(styles.label, 'mt-4')}>
          {variation === 'practitioner' &&
            'Is the caregiver interested in joining SmartStart’s Caregiver Reference Panel to share feedback about the programme?'}
          {variation === 'caregiver' &&
            `Would you be interested in joining SmartStart's Caregiver Reference Panel to share your feedback about the programme?`}
        </label>
        <div className={'mt-2'}>
          <ButtonGroup
            options={joiningReferencePanel}
            onOptionSelected={(value: boolean | boolean[]) => {
              setCareGiverContributionFormValue(
                'interestedInJoiningPanel',
                value as boolean
              );
              setJoinReferencePanel(value as boolean);
              careGiverContributionFormTrigger();
            }}
            selectedOptions={joinReferencePanel}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
            multiple={false}
          />
        </div>
        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={handleFormSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          {renderIcon('SaveIcon', classNames('h-5 w-5 text-white'))}
          <Typography type="h6" className="ml-2" text="Save" color="white" />
        </Button>
      </div>
    </div>
  );
};
