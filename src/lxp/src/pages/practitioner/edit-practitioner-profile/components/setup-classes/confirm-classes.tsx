import { EditClassModel } from '@/schemas/practitioner/edit-class';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { getWeekdayValue } from '@/utils/practitioner/playgroups-utils';
import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';
import {
  ActionListDataItem,
  Button,
  renderIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
  onSubmit: () => void;
}) => {
  const [actionList, setActionList] = useState<ActionListDataItem[]>([]);
  const practitioners = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const formatMeetingDays = (programmes?: ClassProgrammeDto[]) => {
    const meetingDays = programmes
      ?.map((programme) => programme.meetingDay)
      .sort();
    let str = '';

    if (meetingDays?.length === 5) {
      str = 'Every Weekday';
    } else {
      for (const meetingDay of meetingDays || []) {
        const _day = getWeekdayValue(meetingDay).substring(0, 3);
        if (meetingDay === meetingDays?.at(-1)) {
          str = str.concat(_day);
        } else {
          str = str.concat(_day + ', ');
        }
      }
    }

    return str;
  };

  useEffect(() => {
    const list = [];
    for (const classroomGroup of classroomGroups as ClassroomGroupDto[]) {
      const current =
        currentPractitioner?.userId === classroomGroup.practitionerId
          ? currentPractitioner?.user?.firstName
          : 'Practitioner';
      const _practitioner =
        practitioners
          ?.filter((a) => a.userId === classroomGroup?.practitionerId)
          .at(0)?.firstName || current;

      list.push({
        title: classroomGroup.name,
        subTitle: `${_practitioner}; ${formatMeetingDays(
          classroomGroup.classProgrammes
        )}`,
        switchTextStyles: true,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          editClass({
            id: classroomGroup?.id || '',
            classroomId: classroomGroup?.classroom?.id,
            name: classroomGroup.name,
            meetEveryday: classroomGroup.classProgrammes?.length === 5,
            practitionerId: classroomGroup.practitionerId ?? '',
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
      <div className="pb-20">
        <Typography
          type={'h2'}
          text={title}
          color={'primary'}
          className={'mt-3'}
        />
        {classroomGroups.length ? (
          <div>
            <StackedList
              className={'bg-white w-full'}
              listItems={actionList}
              type={'ActionList'}
            />
          </div>
        ) : (
          <>
            <Typography
              type={'help'}
              text={`You must add at least 1 class to ${classroomName}.`}
              color={'primary'}
              className={'mt-3'}
            />
          </>
        )}

        <Button
          className="mt-4"
          color="primary"
          type="filled"
          shape="normal"
          onClick={addClass}
        >
          {renderIcon('PlusSmIcon', 'mr-2 text-white w-5')}
          <Typography
            className="mx-2"
            text="Add class"
            type="help"
            color="white"
          />
        </Button>
      </div>

      {classroomGroups.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white max-h-20">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="primary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            onClick={() => {
              onSubmit();
            }}
          />
        </div>
      )}
    </>
  );
};
