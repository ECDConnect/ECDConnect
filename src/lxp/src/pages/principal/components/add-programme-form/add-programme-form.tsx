import { ProgrammeTypeDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  FormInput,
  Typography,
} from '@ecdlink/ui';
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
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  OnNext,
  PractitionerSetupSteps,
} from '../../setup-principal/setup-principal.types';
import { useEffect } from 'react';
import { practitionerSelectors } from '@/store/practitioner';
import { traineeSelectors } from '@/store/trainee';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';

export const AddProgrammeForm: React.FC<{
  onNext: OnNext;
  setIsNotPrincipal: (item: boolean) => void;
  isNotPrincipal: boolean;
  isFundaAppAdmin: any;
  setIsFundaAppAdmin: any;
  onChangeIsPrincipal: (value: boolean) => void;
}> = ({
  onNext,
  setIsNotPrincipal,
  isFundaAppAdmin,
  setIsFundaAppAdmin,
  onChangeIsPrincipal,
  isNotPrincipal,
}) => {
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const appDispatch = useAppDispatch();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors?.getClassroomGroups);

  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner?.userId || '')
  );
  const traineeVisitData = useSelector(
    traineeSelectors.getTraineeVisitData(traineeTimeline?.sSCoachVisitId)
  );

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

  const { isValid, errors } = useFormState({ control: programmeFormControl });

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
      // if (classroom?.isPrinciple) {
      //   setProgrammeFormValue('isPrincipalOrLeader', true);
      // }
      if (classroom?.name) {
        setProgrammeFormValue('name', classroom?.name);
      }
      // if (classroomGroups?.[0]?.programmeType?.id) {
      //   setProgrammeFormValue('type', classroomGroups?.[0]?.programmeType?.id);
      // }
      if (typeof classroom?.numberOfPractitioners === 'number') {
        setProgrammeFormValue(
          'smartStartPractitioners',
          classroom?.numberOfPractitioners
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
    classroom?.name,
    classroom?.numberOfOtherAssistants,
    classroom?.numberOfPractitioners,
    classroomGroups,
    isSmartLinkImported,
    setProgrammeFormValue,
  ]);

  useEffect(() => {
    if (isTrainee) {
      const programmeName =
        traineeVisitData &&
        traineeVisitData?.find(
          (item) => item?.question === 'What is the name of your preschool?'
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
      id: classroomId,
      name: programme?.name ?? '',
      numberOfPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      imageUrl: '',
      principal: {
        email: user?.email!,
        firstName: user?.firstName!,
        phoneNumber: user?.phoneNumber!,
        profileImageUrl: user?.profileImageUrl!,
        surname: user?.surname!,
        userId: user?.id!,
      },
      siteAddress: {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        id: '',
        name: '',
        postalCode: '',
        ward: '',
      },
    };

    // TODO
    appDispatch(classroomsActions.createClassroom(classroomInputModel));
    appDispatch(classroomsThunkActions.upsertClassroom(classroomInputModel));
    // Should this upsert the classroom ???
  };

  const updateClassroom = (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const classroomInputModel: ClassroomDto = {
      id: classroomId,
      name: programme?.name ?? '',
      numberOfPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      imageUrl: '',
      siteAddress: classroom?.siteAddress!,
      preschoolFeeAmount: classroom?.preschoolFeeAmount,
      preschoolFeeAmountLastUpdateDate:
        classroom?.preschoolFeeAmountLastUpdateDate,
      principal: {
        email: user?.email!,
        firstName: user?.firstName!,
        phoneNumber: user?.phoneNumber!,
        profileImageUrl: user?.profileImageUrl!,
        surname: user?.surname!,
        userId: user?.id!,
      },
    };

    // This won't actually call the BE
    appDispatch(classroomsActions.updateClassroom(classroomInputModel));
    appDispatch(classroomsThunkActions.upsertClassroom(classroomInputModel));
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

  // Do we still have imported users?
  const onSubmitForImportedUser = (e: EditProgrammeModel) => {
    if (!e.isPrincipalOrLeader && e.isPrincipleOrOwnerSmartStarter) {
      setIsNotPrincipal(true);
      onNext(PractitionerSetupSteps.ADD_PHOTO);
    } else {
      if (classroom?.id) {
        updateClassroom(e, classroom.id);
      } else {
        //an imported user could have rejected the invite which would have cleared the classroom
        const classroomId = newGuid();
        createClassroom(e, classroomId);
      }
      onNext(PractitionerSetupSteps.CONFIRM_PRACTITIONERS);
    }
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
    <div className="h-full pt-7">
      <div className="flex flex-col gap-11">
        <div>
          <Card
            className="bg-uiBg mb-6 flex flex-col items-center gap-3 p-6"
            borderRaduis="xl"
            shadowSize="lg"
          >
            <div className="">
              <Cebisa />
            </div>
            <Typography
              color="textDark"
              text={`Ok, let's set up your preschool!`}
              type={'h3'}
              align="center"
            />
          </Card>
        </div>
      </div>

      {isPrincipalOrLeader === true && (
        <div className="my-4">
          <Alert
            type="info"
            title="Each programme must have one principal or owner on Funda App."
          />
        </div>
      )}

      <div className="space-y-4">
        <FormInput<EditProgrammeModel>
          label={'What is the name of your preschool?'}
          register={programmeFormRegister}
          nameProp={'name'}
          placeholder={'E.g. Little Lambs Preschool'}
          type={'text'}
          maxCharacters={40}
          maxLength={40}
          value={getProgrammeFormValues()?.name}
        ></FormInput>

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
            color="quatenary"
            className={styles.button}
            disabled={!getProgrammeFormValues()?.name}
            onClick={
              isSmartLinkImported
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
