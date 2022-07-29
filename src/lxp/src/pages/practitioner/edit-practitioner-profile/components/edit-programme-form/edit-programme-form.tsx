import { ProgrammeTypeDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ButtonGroupTypes } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from '../../edit-practitioner-profile.styles';
import {
  EditProgrammeModel,
  editProgrammeSchema,
} from '@schemas/practitioner/edit-programme';
import {
  EditProgrammeFormProps,
  yesNoOptions,
} from './edit-programme-form.types';

export const EditProgrammeForm: React.FC<EditProgrammeFormProps> = ({
  onSubmit,
  programme,
}) => {
  const {
    getValues: getProgrammeFormValues,
    setValue: setProgrammeFormValue,
    reset: resetProgrammeFormValue,
    register: programmeFormRegister,
    control: programmeFormControl,
  } = useForm<EditProgrammeModel>({
    resolver: yupResolver(editProgrammeSchema),
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: programmeFormControl });

  const programData = useSelector(staticDataSelectors.getProgrammeTypes);

  const { isPrincipleOrLeader, assistants, type } =
    useWatch<EditProgrammeModel>({
      control: programmeFormControl,
      defaultValue: {},
    });

  useEffect(() => {
    resetProgrammeFormValue(programme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programme]);

  return (
    <div>
      <Typography
        type={'h2'}
        text={'Set up your programme'}
        color={'textDark'}
        className={'my-3'}
      />
      <div className="space-y-4">
        <FormInput<EditProgrammeModel>
          label={'What is the name of your programme?'}
          register={programmeFormRegister}
          nameProp={'name'}
          placeholder={'E.g. Little Lambs Preschool'}
          type={'text'}
        ></FormInput>

        <div className={'w-full'}>
          <label className={styles.label}>
            What type of programme are you running of planning to run?
          </label>
          <div className="mt-1">
            <ButtonGroup<string>
              options={
                (programData &&
                  programData.map((x: ProgrammeTypeDto) => {
                    return { text: x.description, value: x.id ?? '' };
                  })) ||
                []
              }
              onOptionSelected={(value: string | string[]) => {
                setProgrammeFormValue('type', value as string, {
                  shouldValidate: true,
                });
              }}
              selectedOptions={type}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
            />
          </div>
        </div>

        <div className={'w-full'}>
          <label className={styles.label}>
            Are you the principal or leader of the programme?
          </label>
          <div className="mt-1">
            <ButtonGroup<boolean>
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) =>
                setProgrammeFormValue('isPrincipleOrLeader', value as boolean, {
                  shouldValidate: true,
                })
              }
              selectedOptions={[getProgrammeFormValues().isPrincipleOrLeader]}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
            />
          </div>
        </div>

        {isPrincipleOrLeader !== false && (
          <>
            <FormInput<EditProgrammeModel>
              label={
                'How many other SmartStart practitioners work at your site?'
              }
              register={programmeFormRegister}
              nameProp={'smartStartPractitioners'}
              placeholder={'Enter a number'}
              type={'number'}
              hint={'If there are no other practitioners, enter 0'}
            ></FormInput>

            <FormInput<EditProgrammeModel>
              label={
                'How many non-SmartStart trained teaching assistants do have?'
              }
              register={programmeFormRegister}
              nameProp={'nonSmartStartPractitioners'}
              placeholder={'Enter a number'}
              type={'number'}
            ></FormInput>

            <FormInput<EditProgrammeModel>
              label={
                'How many other assistants do you have, not counting the assistants above?'
              }
              register={programmeFormRegister}
              nameProp={'assistants'}
              placeholder={'Enter a number'}
              type={'number'}
            ></FormInput>

            {assistants && assistants > 0 && (
              <div className={'w-full'}>
                <label className={styles.label}>
                  Do you teach any classes yourself?
                </label>
                <div className="mt-1">
                  <ButtonGroup<boolean>
                    options={yesNoOptions}
                    onOptionSelected={(value: boolean | boolean[]) =>
                      setProgrammeFormValue('isTeacher', value as boolean, {
                        shouldValidate: true,
                      })
                    }
                    selectedOptions={[getProgrammeFormValues().isTeacher]}
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <Divider />
        <div className="mb-2">
          <Button
            type="filled"
            color="primary"
            className={styles.button}
            disabled={!isValid}
            onClick={() => onSubmit(getProgrammeFormValues())}
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
