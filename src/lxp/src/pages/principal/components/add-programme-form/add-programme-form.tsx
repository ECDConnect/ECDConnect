import { generateUniqueCode } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Card, FormInput, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as styles from './add-programme-form.styles';
import {
  EditProgrammeModel,
  editProgrammeSchema,
} from '@schemas/practitioner/edit-programme';
import { userSelectors } from '@/store/user';
import { classroomsActions, classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  OnNext,
  PractitionerSetupSteps,
} from '../../setup-principal/setup-principal.types';
import { useEffect } from 'react';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';

export const AddProgrammeForm: React.FC<{
  onNext: OnNext;
  setIsNotPrincipal: (item: boolean) => void;
  isNotPrincipal: boolean;
  onChangeIsPrincipal: (value: boolean) => void;
}> = ({ onNext, setIsNotPrincipal }) => {
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors?.getClassroomGroups);

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

  const { isPrincipalOrLeader, isPrincipleOrOwnerSmartStarter } =
    useWatch<EditProgrammeModel>({
      control: programmeFormControl,
      defaultValue: {},
    });

  const createClassroom = async (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const uniquePreschoolCode = generateUniqueCode(6);

    const classroomInputModel: ClassroomDto = {
      id: classroomId,
      name: programme?.name ?? '',
      isDummySchool: false,
      numberPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      classroomImageUrl: '',
      principal: {
        email: user?.email!,
        firstName: user?.firstName!,
        phoneNumber: user?.phoneNumber!,
        profileImageUrl: user?.profileImageUrl!,
        surname: user?.surname!,
        userId: user?.id!,
      },
      siteAddress: {
        area: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        id: '',
        name: '',
        latitude: null,
        longitude: null,
        municipality: '',
        postalCode: '',
        provinceId: '',
        province: null,
        ward: '',
      },
      preschoolCode: uniquePreschoolCode,
    };

    // EC-3957 only add classroom to state - we save to database on the last step (setup-principal onAllStepsComplete)
    await appDispatch(classroomsActions.createClassroom(classroomInputModel));

    if (classroomGroups?.length > 0) {
      for (const classroomGroup of classroomGroups) {
        const classroomGroupInput = {
          ...classroomGroup,
          classroomId: classroom?.id!,
        };
        appDispatch(
          classroomsActions.updateClassroomGroup(classroomGroupInput)
        );
      }
    }
  };

  const updateClassroom = async (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const uniquePreschoolCode = generateUniqueCode(6);

    const classroomInputModel: ClassroomDto = {
      id: classroomId,
      name: programme?.name ?? '',
      isDummySchool: false,
      numberPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      classroomImageUrl: '',
      siteAddress: classroom?.siteAddress!,
      principal: {
        email: user?.email!,
        firstName: user?.firstName!,
        phoneNumber: user?.phoneNumber!,
        profileImageUrl: user?.profileImageUrl!,
        surname: user?.surname!,
        userId: user?.id!,
      },
      preschoolCode: uniquePreschoolCode,
    };

    // EC-3957 only add classroom to state - we save to database when we add the classes
    await appDispatch(classroomsActions.updateClassroom(classroomInputModel));

    if (classroomGroups?.length > 0) {
      for (const classroomGroup of classroomGroups) {
        const classroomGroupInput = {
          ...classroomGroup,
          classroomId: classroom?.id!,
        };
        appDispatch(
          classroomsActions.updateClassroomGroup(classroomGroupInput)
        );
      }
    }
  };

  const onSubmit = (e: EditProgrammeModel) => {
    if (isPrincipleOrOwnerSmartStarter === true) {
      setIsNotPrincipal(true);
      onNext(PractitionerSetupSteps.ADD_PHOTO);
      return;
    } else {
      if (classroom?.id) {
        updateClassroom(e, classroom.id);
      } else {
        const classroomId = newGuid();
        createClassroom(e, classroomId);
      }
      onNext(PractitionerSetupSteps.CONFIRM_PRACTITIONERS);
    }
  };

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
            onClick={handleSubmit(onSubmit)} // Navigate to a different page if it is principle
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
