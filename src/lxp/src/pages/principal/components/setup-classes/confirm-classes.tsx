import { EditClassModel } from '@/schemas/practitioner/edit-class';
import { practitionerSelectors } from '@/store/practitioner';
import { formatMeetingDays } from '@/utils/practitioner/playgroups-utils';
import {
  ActionListDataItem,
  Button,
  Card,
  renderIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  OnNext,
  PractitionerSetupSteps,
} from '../../setup-principal/setup-principal.types';
import { UNSURE_CLASS } from '@/constants/classroom';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { classroomsSelectors } from '@/store/classroom';

export const ConfirmClasses = ({
  title,
  classroomName,
  classroomGroups,
  addClass,
  editClass,
  onSubmit,
}: {
  title: string;
  classroomName: string;
  addClass: () => void;
  editClass: (classroom: EditClassModel) => void;
  classroomGroups: ClassroomGroupDto[];
  onSubmit: OnNext;
}) => {
  const [actionList, setActionList] = useState<ActionListDataItem[]>([]);
  const practitioners = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const classroomGroupsFromStore = useSelector(
    classroomsSelectors.getClassroomGroups
  );

  // The principal should not be able to edit, remove, or add an unsure class during profile setup flow
  const filteredClassroomGroups = classroomGroups.filter(
    (item) => item?.name !== UNSURE_CLASS
  );

  useEffect(() => {
    const list = [];
    for (const classroomGroup of filteredClassroomGroups as ClassroomGroupDto[]) {
      const current =
        currentPractitioner?.userId === classroomGroup.userId
          ? currentPractitioner?.user?.firstName ||
            currentPractitioner?.user?.userName
          : 'Practitioner';
      const _practitioner =
        practitioners?.filter((a) => a.userId === classroomGroup?.userId).at(0)
          ?.firstName || current;

      list.push({
        title: classroomGroup.name,
        subTitle: `${_practitioner}; ${formatMeetingDays(
          classroomGroup.classProgrammes
        )}`,
        switchTextStyles: false,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          editClass({
            id: classroomGroup?.id || '',
            classroomId: classroomGroup?.classroomId,
            name: classroomGroup.name,
            meetEveryday: classroomGroup.classProgrammes?.length === 5,
            practitionerId: classroomGroup.userId ?? '',
            meetingDays:
              classroomGroup.classProgrammes?.map(
                (a: { meetingDay: any }) => a.meetingDay
              ) ?? [],
            isFullDay:
              classroomGroup.classProgrammes?.at(0)?.isFullDay ?? false,
          });
        },
      });
    }

    setActionList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups, editClass]);

  return (
    <>
      <div className="flex flex-col gap-11">
        <div className="flex flex-col gap-11">
          <div className="flex w-full px-4">
            <Card
              className="bg-uiBg mb-6 flex w-full flex-col items-center gap-3 p-6"
              borderRaduis="xl"
              shadowSize="lg"
            >
              <div className="">
                <Cebisa />
              </div>
              <Typography
                color="textDark"
                text={`Add at least 1 class to ${classroomName}.`}
                type={'h3'}
                align="center"
              />
            </Card>
          </div>
        </div>
      </div>
      <div className="pb-8">
        <Typography
          type={'h2'}
          text={
            classroomGroups.length > 0 && classroomGroupsFromStore.length > 0
              ? ''
              : 'Add a class'
          }
          color={'textDark'}
          className={'mt-3'}
        />
        {classroomGroups.length > 0 && classroomGroupsFromStore.length > 0 && (
          <div>
            <StackedList
              className={'w-full bg-white'}
              listItems={actionList}
              type={'ActionList'}
            />
          </div>
        )}

        <Button
          className="mt-4"
          color="quatenary"
          type="filled"
          onClick={addClass}
        >
          {renderIcon('PlusSmIcon', 'mr-2 text-white w-5')}
          <Typography text="Add class" type="help" color="white" />
        </Button>
      </div>

      {classroomGroups.length > 0 && (
        <div className="max-h-20 bg-white p-4">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="quatenary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            onClick={() => {
              onSubmit(PractitionerSetupSteps.ADD_PHOTO);
            }}
          />
        </div>
      )}
    </>
  );
};
