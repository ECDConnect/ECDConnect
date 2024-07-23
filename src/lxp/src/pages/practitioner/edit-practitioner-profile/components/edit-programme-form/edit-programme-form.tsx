import { ProgrammeTypeDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ButtonGroup,
  FormInput,
  Typography,
  ButtonGroupTypes,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useForm, useFormState, useWatch, Controller } from 'react-hook-form';
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
    shouldUnregister: true,
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: programmeFormControl });
  const { isPrincipalOrLeader, isPrincipleOrOwnerSmartStarter } =
    useWatch<EditProgrammeModel>({
      control: programmeFormControl,
      defaultValue: {},
    });

  const programData = useSelector(staticDataSelectors.getProgrammeTypes);

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

      {isPrincipalOrLeader === true && (
        <div className="my-4">
          <Alert
            type="info"
            title="Each programme must have one principal or owner on Funda App."
          />
        </div>
      )}

      <div className="space-y-4">
        {isPrincipalOrLeader === true && (
          <>
            <FormInput<EditProgrammeModel>
              label={'What is the name of your programme?'}
              register={programmeFormRegister}
              nameProp={'name'}
              placeholder={'E.g. Little Lambs Preschool'}
              type={'text'}
            ></FormInput>

            <div className={'w-full'}>
              <label className={styles.label}>
                What type of programme are you running or planning to run?
              </label>
              <div className="mt-1">
                <Controller
                  name={'type'}
                  control={programmeFormControl}
                  render={({ field: { onChange, value, ref } }) => (
                    <ButtonGroup<string>
                      inputRef={ref}
                      options={
                        (programData &&
                          programData.map((x: ProgrammeTypeDto) => {
                            return { text: x.description, value: x.id ?? '' };
                          })) ||
                        []
                      }
                      onOptionSelected={onChange}
                      selectedOptions={value}
                      color="secondary"
                      type={ButtonGroupTypes.Button}
                      className={'w-full'}
                    />
                  )}
                ></Controller>
              </div>
            </div>

            <FormInput<EditProgrammeModel>
              label={
                'How many other SmartStart practitioners work at your site?'
              }
              register={programmeFormRegister}
              nameProp={'smartStartPractitioners'}
              placeholder={'Enter a number'}
              type={'number'}
              hint={'If there are no other practitioners, enter 0'}
              onKeyDown={(e: any) => {}}
            ></FormInput>

            <FormInput<EditProgrammeModel>
              label={
                'How many non-SmartStart trained teaching assistants do you have?'
              }
              register={programmeFormRegister}
              nameProp={'nonSmartStartPractitioners'}
              placeholder={'Enter a number'}
              type={'number'}
              onKeyDown={(e: any) => {}}
            ></FormInput>
          </>
        )}

        {isPrincipalOrLeader === false && (
          <div className={'w-full'}>
            <label className={styles.label}>
              Is the principal/owner of your programme a SmartStarter?
            </label>
            <div className="mt-1">
              <Controller
                name="isPrincipleOrOwnerSmartStarter"
                control={programmeFormControl}
                render={({ field: { onChange, value, ref } }) => (
                  <ButtonGroup<boolean>
                    inputRef={ref}
                    options={yesNoOptions}
                    onOptionSelected={onChange}
                    selectedOptions={value}
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                  />
                )}
              />
            </div>
          </div>
        )}

        {isPrincipleOrOwnerSmartStarter === true && (
          <div className="my-4">
            <Alert
              type="warning"
              title="Ask the principal of the programme to add your details to their programme on Funda App."
            />
          </div>
        )}

        <div className="mb-2">
          <Button
            type="filled"
            color="primary"
            className={styles.button}
            disabled={!isValid}
            onClick={() => onSubmit(getProgrammeFormValues())} // Navigate to a different page if it is principle
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
