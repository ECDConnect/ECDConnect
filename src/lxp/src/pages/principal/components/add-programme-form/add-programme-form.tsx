import { ClassroomDto, ProgrammeTypeDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, ButtonGroup, FormInput, Typography } from '@ecdlink/ui';
import { ButtonGroupTypes } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useForm, useFormState, useWatch, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './add-programme-form.styles';

import {
  EditProgrammeModel,
  editProgrammeSchema,
} from '@schemas/practitioner/edit-programme';
import { yesNoOptions } from './add-programme-form.types';
import { userSelectors } from '@/store/user';
import { classroomsActions, classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  OnNext,
  PractitionerSetupSteps,
} from '../../setup-principal/setup-principal.types';
import { useEffect } from 'react';
import { practitionerSelectors } from '@/store/practitioner';
import { traineeSelectors } from '@/store/trainee';

export const AddProgrammeForm: React.FC<{
  onNext: OnNext;
  setIsNotPrincipal: any;
  isFundaAppAdmin: any;
  setIsFundaAppAdmin: any;
  onChangeIsPrincipal: (value: boolean) => void;
}> = ({
  onNext,
  setIsNotPrincipal,
  isFundaAppAdmin,
  setIsFundaAppAdmin,
  onChangeIsPrincipal,
}) => {
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const appDispatch = useAppDispatch();
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const classroomGroups = useSelector(
    classroomsSelectors?.getAllClassroomGroups
  );
  const traineeVisitData = useSelector(traineeSelectors?.getTraineeVisitData);

  const {
    getValues: getProgrammeFormValues,
    setValue: setProgrammeFormValue,
    register: programmeFormRegister,
    control: programmeFormControl,
    handleSubmit,
  } = useForm<EditProgrammeModel>({
    resolver: yupResolver(editProgrammeSchema),
    shouldUnregister: true,
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: programmeFormControl });
  const {
    isPrincipalOrLeader,
    isPrincipleOrOwnerSmartStarter,
    name,
    type,
    nonSmartStartPractitioners,
    smartStartPractitioners,
  } = useWatch<EditProgrammeModel>({
    control: programmeFormControl,
    defaultValue: {},
  });

  const programData = useSelector(staticDataSelectors.getProgrammeTypes);

  const isSmartLinkImported = user?.isImported;
  const isTrainee = practitioner?.isTrainee;

  useEffect(() => {
    if (isSmartLinkImported) {
      if (classroom?.isPrinciple) {
        setProgrammeFormValue('isPrincipalOrLeader', true);
      }
      if (classroom?.name) {
        setProgrammeFormValue('name', classroom?.name);
      }
      if (classroomGroups?.[0]?.programmeType?.id) {
        setProgrammeFormValue('type', classroomGroups?.[0]?.programmeType?.id);
      }
      if (typeof classroom?.numberPractitioners === 'number') {
        setProgrammeFormValue(
          'smartStartPractitioners',
          classroom?.numberPractitioners
        );
      }
      if (typeof classroom?.numberOfOtherAssistants === 'number') {
        setProgrammeFormValue(
          'nonSmartStartPractitioners',
          classroom?.numberOfOtherAssistants
        );
      }
    }
  }, [
    classroom?.isPrinciple,
    classroom?.name,
    classroom?.numberOfOtherAssistants,
    classroom?.numberPractitioners,
    classroomGroups,
    isSmartLinkImported,
    setProgrammeFormValue,
  ]);

  useEffect(() => {
    if (isTrainee) {
      const programmeName =
        traineeVisitData &&
        traineeVisitData?.find(
          (item) => item?.question === 'What is the name of your programme?'
        )?.questionAnswer;
      const programmeType =
        traineeVisitData &&
        traineeVisitData?.find(
          (item) =>
            item?.question ===
            ' What type of programme are you running or planning to run?'
        )?.questionAnswer;
      if (programmeName) {
        setProgrammeFormValue('name', programmeName);
      }
      if (programmeType) {
        setProgrammeFormValue('type', programmeType);
      }
    }
  }, [isTrainee, setProgrammeFormValue, traineeVisitData]);

  const validationForFundaAdmin =
    name !== undefined &&
    name !== null &&
    type !== undefined &&
    type !== null &&
    nonSmartStartPractitioners !== undefined &&
    nonSmartStartPractitioners !== null &&
    smartStartPractitioners !== undefined &&
    smartStartPractitioners !== null;
  const createClassroom = (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const classroomInputModel: ClassroomDto = {
      userId: user?.id ?? '',
      id: classroomId,
      name: programme?.name ?? '',
      isPrinciple: programme?.isPrincipalOrLeader ?? false,
      numberPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      insertedDate: new Date().toISOString(),
      isActive: true,
    };
    const programmeInput = programData?.find((x) => x.id === programme.type);

    appDispatch(classroomsActions.createClassroom(classroomInputModel));
    if (programmeInput) {
      appDispatch(classroomsActions.setProgrammeType(programmeInput));
    }
  };

  const updateClassroom = (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const classroomInputModel: ClassroomDto = {
      userId: user?.id ?? '',
      id: classroomId,
      name: programme?.name ?? '',
      isPrinciple: programme?.isPrincipalOrLeader ?? false,
      numberPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      insertedDate: new Date().toISOString(),
      isActive: true,
      siteAddress: classroom?.siteAddress,
      siteAddressId: classroom?.siteAddressId,
      preschoolFeeAmount: classroom?.preschoolFeeAmount,
      preschoolFeeAmountLastUpdateDate:
        classroom?.preschoolFeeAmountLastUpdateDate,
    };

    const programmeInput = programData?.find((x) => x.id === programme.type);
    appDispatch(classroomsActions.updateClassroom(classroomInputModel));
    if (programmeInput) {
      appDispatch(classroomsActions.setProgrammeType(programmeInput));
    }
  };

  const onSubmit = (e: EditProgrammeModel) => {
    if (!isFundaAppAdmin && isPrincipleOrOwnerSmartStarter === true) {
      setIsNotPrincipal(true);
      onNext(PractitionerSetupSteps.ADD_PHOTO);
      return;
    }
    const classroomId = newGuid();
    createClassroom(e, classroomId);
    onNext(PractitionerSetupSteps.CONFIRM_PRACTITIONERS);
  };

  const onSubmitForImportedUser = (e: EditProgrammeModel) => {
    if (classroom?.id) {
      updateClassroom(e, classroom.id);
    }
    onNext(PractitionerSetupSteps.CONFIRM_PRACTITIONERS);
  };

  useEffect(() => {
    if (
      isPrincipalOrLeader === false &&
      isPrincipleOrOwnerSmartStarter === false
    ) {
      setIsFundaAppAdmin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPrincipalOrLeader,
    isPrincipleOrOwnerSmartStarter,
    setProgrammeFormValue,
  ]);

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
        {!(
          isPrincipleOrOwnerSmartStarter === false &&
          isPrincipalOrLeader === false
        ) && (
          <div className={'w-full'}>
            <label className={styles.label}>
              Are you the principal/owner of your ECD programme?
            </label>
            <div className="mt-1">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                onOptionSelected={(value: boolean | boolean[]) =>
                  setProgrammeFormValue(
                    'isPrincipalOrLeader',
                    value as boolean,
                    {
                      shouldValidate: true,
                    }
                  )
                }
                selectedOptions={[getProgrammeFormValues().isPrincipalOrLeader]}
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
              />
            </div>
          </div>
        )}

        {(isPrincipalOrLeader === true ||
          (isFundaAppAdmin === true && isPrincipalOrLeader === false)) && (
          <>
            {isPrincipalOrLeader === false && isFundaAppAdmin === true && (
              <div className="my-4">
                <Alert
                  type="info"
                  title="Each programme must have one person responsible for administration tasks on Funda App."
                  message={`• Since the principal at your programme is not a SmartStarter, you will be required to fill this administration role on Funda App.`}
                />
              </div>
            )}
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
          </>
        )}

        {isPrincipalOrLeader === false && !isFundaAppAdmin && (
          <div className={'w-full'}>
            <label className={styles.label}>
              Is the principal/owner of your programme a SmartStarter?
            </label>
            <div className="mt-1">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                onOptionSelected={(value: boolean | boolean[]) => {
                  onChangeIsPrincipal(value as boolean);
                  setProgrammeFormValue(
                    'isPrincipleOrOwnerSmartStarter',
                    value as boolean,
                    {
                      shouldValidate: true,
                    }
                  );
                }}
                selectedOptions={[
                  getProgrammeFormValues().isPrincipleOrOwnerSmartStarter,
                ]}
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
              />
            </div>
          </div>
        )}

        {isPrincipleOrOwnerSmartStarter === true &&
          isPrincipalOrLeader === false && (
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
            disabled={isFundaAppAdmin ? !validationForFundaAdmin : !isValid}
            onClick={
              isSmartLinkImported && classroom?.id
                ? handleSubmit(onSubmitForImportedUser)
                : handleSubmit(onSubmit)
            } // Navigate to a different page if it is principle
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
