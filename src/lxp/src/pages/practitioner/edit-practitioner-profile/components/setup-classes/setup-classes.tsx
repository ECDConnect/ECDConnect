import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';
import { AddClassForm } from './add-class-form';
import { ConfirmClasses } from './confirm-classes';
import { EditClass } from './edit-class';
import { EditClassModel } from '@/schemas/practitioner/edit-class';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

interface SetupClassesProps {
  title?: string;
  onSubmit: () => void;
}

enum SetupClassesPage {
  confirmClasses = 1,
  addClass = 2,
  editClass = 3,
}

export const SetupClasses = ({
  onSubmit,
  title = 'Add Classes',
}: SetupClassesProps) => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroupsFromStore = useSelector(
    classroomsSelectors.getClassroomGroups
  );

  const [currentTitle, setCurrentTitle] = useState(title);
  const [editClassroom, setEditClassroom] = useState<EditClassModel>(
    {} as EditClassModel
  );
  const [classroomGroups, setClassroomGroups] = useState<ClassroomGroupDto[]>();
  const [currentPage, setCurrentPage] = useState<SetupClassesPage>(
    SetupClassesPage.confirmClasses
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroupsFromStore.length]);

  const onEditClass = (classroom: EditClassModel) => {
    setEditClassroom(classroom);
    setCurrentPage(SetupClassesPage.editClass);
  };

  const renderPage = (step: SetupClassesPage) => {
    switch (step) {
      case SetupClassesPage.confirmClasses:
        return (
          <ConfirmClasses
            onSubmit={onSubmit}
            title={currentTitle}
            classroomName={classroom?.name || 'your Classroom'}
            addClass={() => {
              setCurrentPage(SetupClassesPage.addClass);
            }}
            editClass={onEditClass}
            classroomGroups={classroomGroups || []}
          />
        );
      case SetupClassesPage.addClass:
        return (
          <AddClassForm
            onSubmit={() => {
              setCurrentPage(SetupClassesPage.confirmClasses);
            }}
          />
        );
      case SetupClassesPage.editClass:
        return (
          <EditClass
            onSubmit={() => {
              setCurrentPage(SetupClassesPage.confirmClasses);
            }}
            classToEdit={editClassroom}
            editClassroomId={classroom?.id as string}
          />
        );
      default:
        return <></>;
    }
  };

  return renderPage(currentPage);
};
