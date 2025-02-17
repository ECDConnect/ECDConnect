import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';
import { AddClassForm } from './add-class-form';
import { ConfirmClasses } from './confirm-classes';
import { EditClass } from './edit-class';
import { EditClassModel } from '@/schemas/practitioner/edit-class';
import {
  ConfirmClassesSteps,
  OnNext,
} from '../../setup-principal/setup-principal.types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

interface SetupClassesProps {
  onNext: OnNext;
  page: ConfirmClassesSteps;
  setClassesPage: React.Dispatch<React.SetStateAction<ConfirmClassesSteps>>;
}

export const SetupClasses = ({
  onNext,
  page,
  setClassesPage,
}: SetupClassesProps) => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroupsFromStore = useSelector(
    classroomsSelectors.getClassroomGroups
  );

  const [currentTitle, setCurrentTitle] = useState('Add Classes');
  const [editClassroom, setEditClassroom] = useState<EditClassModel>(
    {} as EditClassModel
  );
  const [classroomGroups, setClassroomGroups] = useState<ClassroomGroupDto[]>();

  useEffect(() => {
    if (classroomGroupsFromStore.length) {
      setCurrentTitle('Confirm Class');
      const _classroomGroups: ClassroomGroupDto[] = [];
      for (const classroomGroup of classroomGroupsFromStore) {
        _classroomGroups.push({
          ...classroomGroup,
        });
      }
      setClassroomGroups(_classroomGroups);
    }
  }, [classroomGroupsFromStore]);

  const onEditClass = (classroom: EditClassModel) => {
    setEditClassroom(classroom);
    setClassesPage(ConfirmClassesSteps.EDIT_CLASS);
  };

  const goBackToConfirmPage = () => {
    setClassesPage(ConfirmClassesSteps.CONFIRM_CLASSES);
  };

  const renderPage = (step: ConfirmClassesSteps) => {
    switch (step) {
      case ConfirmClassesSteps.CONFIRM_CLASSES:
        return (
          <ConfirmClasses
            onSubmit={onNext}
            title={currentTitle}
            classroomName={classroom?.name || 'your Classroom'}
            addClass={() => {
              setClassesPage(ConfirmClassesSteps.ADD_CLASS);
            }}
            editClass={onEditClass}
            classroomGroups={classroomGroups || []}
          />
        );
      case ConfirmClassesSteps.ADD_CLASS:
        return <AddClassForm onSubmit={goBackToConfirmPage} />;
      case ConfirmClassesSteps.EDIT_CLASS:
        return (
          <EditClass
            onSubmit={goBackToConfirmPage}
            classToEdit={editClassroom}
            editClassroomId={classroom?.id as string}
          />
        );
      default:
        return <></>;
    }
  };

  return renderPage(page);
};
