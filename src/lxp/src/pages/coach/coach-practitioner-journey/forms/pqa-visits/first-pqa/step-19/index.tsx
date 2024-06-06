import {
  Alert,
  AttendanceListDataItem,
  AttendanceStatus,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import {
  parseBool,
  replaceBraces,
  usePrevious,
  useSessionStorage,
} from '@ecdlink/core';
import { filterInfo } from '@/pages/classroom/attendance/components/attendance-list/attendance-list';

import { getAttendanceStatusCheck } from '@/utils/classroom/attendance/track-attendance-utils';
import { getDay } from 'date-fns';
import ClassProgrammeAttendanceList from '@/pages/classroom/attendance/components/class-programme-attendance-list/class-programme-attendance-list';
import { AttendanceState } from '@/pages/classroom/attendance/components/attendance-list/attendance-list.types';
import { PractitionerService } from '@/services/PractitionerService';
import { ClassroomGroup } from '@ecdlink/graphql';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

export const step19Question2Pqa =
  'Does {client} need to register any children on Funda App?';

interface State {
  question: string;
  answer: string;
}

export const Step19 = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [presentChildrenCount, setPresentChildrenCount] = useState<number>(0);
  const [absentChildrenCount, setAbsentChildrenCount] = useState<number>(0);
  const [attendanceGroups, setAttendanceGroups] = useState<AttendanceState[]>();
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();

  const [questions, setAnswers] = useState([
    {
      question: 'Child attendance & registration',
      answer: '',
    },
    {
      question: step19Question2Pqa,
      answer: '',
    },
  ]);

  const visitSection = 'Step 19';
  const name = smartStarter?.user?.firstName || 'the SmartStarter';
  const hasChildren = !!presentChildrenCount || !!absentChildrenCount;

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      visitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const isPractitionerUser = user?.id === practitioner?.userId;

  const { isOnline } = useOnlineStatus();

  const userAuth = useSelector(authSelectors.getAuthUser);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );
  const previousClassroomGroups = usePrevious(classroomGroups) as
    | ClassroomGroupDto[]
    | undefined;

  const currentClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === smartStarter?.userId
  );
  const isPrincipal = smartStarter?.isPrincipal === true;
  const currentClassProgrammes = currentClassroomGroups
    .flatMap((x) => x.classProgrammes)
    .filter((x) => x.isActive);

  const primaryClassProgramme = currentClassProgrammes.filter(
    (prog) => prog.meetingDay === getDay(new Date())
  );

  const options = [
    { text: 'Yes', value: true, disabled: isViewAnswers },
    { text: 'No', value: false, disabled: isViewAnswers },
  ];

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      setEnableButton?.(updatedQuestions[1].answer !== '');
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const onAttendanceChange = useCallback(
    (items: AttendanceListDataItem[]) => {
      const currentAnswers = items
        .filter((item) => item.status === AttendanceStatus.Present)
        .map((item) => item.attenendeeId);

      onOptionSelected(currentAnswers, 0);
    },
    [onOptionSelected]
  );

  const onFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setSelectedClassroomGroups(value.map((x) => x.value));
  };

  const validateAttendanceList = (
    attendanceListId: string,
    updateList: AttendanceListDataItem[],
    isPrimaryList: boolean
  ) => {
    const newAttendanceGroups = [...(attendanceGroups || [])];
    const groupIndex = newAttendanceGroups.findIndex(
      (x) => x.cacheId === attendanceListId
    );

    if (groupIndex === -1) {
      newAttendanceGroups.push({
        cacheId: attendanceListId,
        isRequired: isPrimaryList,
        list: updateList,
      });
      setAttendanceGroups(newAttendanceGroups);
      updateAttendanceState(newAttendanceGroups);
    } else {
      newAttendanceGroups.splice(groupIndex, 1, {
        cacheId: attendanceListId,
        isRequired: isPrimaryList,
        list: updateList,
      });
      setAttendanceGroups(
        newAttendanceGroups.filter((x) => x.cacheId === attendanceListId)
      );
      updateAttendanceState(
        newAttendanceGroups.filter((x) => x.cacheId === attendanceListId)
      );
    }
  };

  const updateAttendanceState = useCallback(
    (attendanceGroups: AttendanceState[]) => {
      const attendanceStatusCheck = getAttendanceStatusCheck(
        attendanceGroups,
        isButtonActive
      );
      setPresentChildrenCount(attendanceStatusCheck.presentCount);
      setAbsentChildrenCount(attendanceStatusCheck.absentCount);
      setIsButtonActive(attendanceStatusCheck.isValid);
    },
    [isButtonActive]
  );

  const onSetClassroomGroups = useCallback(() => {
    if (
      classroomGroups &&
      previousClassroomGroups?.length !== classroomGroups.length
    ) {
      const selectedGroups = isPrincipal
        ? currentClassroomGroups.filter(
            (x) => x.id === primaryClassProgramme[0]?.classroomGroupId
          )
        : classroomGroups.filter(
            (x) => x.id === primaryClassProgramme[0]?.classroomGroupId
          );
      setSelectedClassroomGroups(selectedGroups);
    }
  }, [
    classroomGroups,
    currentClassroomGroups,
    isPrincipal,
    previousClassroomGroups?.length,
    primaryClassProgramme,
  ]);

  const classroomsDetailsForPractitioner = useCallback(async () => {
    // Needs to be updated
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      isPractitionerUser ? user?.id! : smartStarter?.userId!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [isPractitionerUser, smartStarter, user?.id, userAuth?.auth_token]);

  const renderTitle = useMemo(() => {
    if (!hasChildren) {
      return 'There are no children registered yet.';
    }

    if (!selectedClassroomGroups.length) {
      return `${name} is not assigned to any classes ${
        isOnline
          ? `at ${
              practitionerClassroomDetails?.[0].programmeType?.description || ''
            } `
          : ''
      }`;
    }

    return 'Please take attendance for the children here today';
  }, [
    selectedClassroomGroups.length,
    hasChildren,
    isOnline,
    name,
    practitionerClassroomDetails,
  ]);

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const updatedQuestions = questions.map((question) => {
        const correspondingQuestion = previousData?.questions.find(
          (secondQuestion) => secondQuestion?.question === question.question
        );

        if (correspondingQuestion) {
          const isQuestion2 =
            correspondingQuestion.question.includes(step19Question2Pqa);

          return {
            ...question,
            answer:
              isQuestion2 && correspondingQuestion.answer
                ? parseBool(String(correspondingQuestion.answer))
                : correspondingQuestion.answer,
          };
        }

        return question;
      });

      setAnswers(updatedQuestions as State[]);
    }
  }, [
    isViewAnswers,
    previousData?.questions,
    previousStatePreviousData?.questions.length,
    questions,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  useEffect(() => {
    classroomsDetailsForPractitioner();
  }, [classroomsDetailsForPractitioner, setEnableButton]);

  useEffect(() => {
    onSetClassroomGroups();
  }, [onSetClassroomGroups]);

  useEffect(() => {
    updateAttendanceState(attendanceGroups ?? []);
  }, [selectedClassroomGroups, attendanceGroups, updateAttendanceState]);

  return (
    <>
      <Typography
        className="px-4 pt-4"
        type="h2"
        text={questions[0].question}
        color="textDark"
      />
      {isViewAnswers && (
        <Alert
          className="mx-4 mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Typography
        className="px-4 pt-4"
        type="h4"
        text={renderTitle}
        color="textDark"
      />
      {hasChildren && currentClassroomGroups.length > 1 && (
        <SearchDropDown<any>
          displayMenuOverlay
          menuItemClassName="w-11/12 left-4"
          className="ml-2"
          disabled={isViewAnswers}
          options={
            currentClassroomGroups.map((x) => {
              return {
                id: x.id ?? '',
                value: x,
                label: x.name,
                disabled: false,
              };
            }) || []
          }
          onChange={(value) => onFilterItemsChanges(value)}
          placeholder={'Class'}
          pluralSelectionText={'Classes'}
          color={'secondary'}
          multiple
          selectedOptions={selectedClassroomGroups.map((x) => ({
            id: x.id ?? '',
            value: x,
            label: x.name,
          }))}
          info={{
            name: `Filter by:${filterInfo?.filterName}`,
            hint: filterInfo?.filterHint || '',
          }}
        />
      )}
      <Divider dividerType="dashed" className="m-4" />
      {hasChildren && (
        <div className={`mb-4 flex  flex-row items-center gap-2 px-4`}>
          <Typography
            type="h1"
            color={!!presentChildrenCount ? 'successMain' : 'textDark'}
            text={String(presentChildrenCount)}
          />
          <Typography type="h4" text="present" />
          <Typography
            className="ml-10"
            type="h1"
            color={!!absentChildrenCount ? 'errorMain' : 'textDark'}
            text={String(absentChildrenCount)}
          />
          <Typography type="h4" text="absent" />
        </div>
      )}
      {selectedClassroomGroups.map((selectedGroup, idx) => {
        const isPrimaryList =
          selectedGroup.id === primaryClassProgramme[0]?.classroomGroupId;
        return (
          <div
            key={`attendanceList${selectedGroup.id}`}
            id={`attendanceList${selectedGroup.id}`}
            className={` ${hasChildren && 'pb-6'}`}
          >
            <ClassProgrammeAttendanceList
              key={`class_attendance_list_${idx}`}
              isPrimaryClass={isPrimaryList}
              classroomGroup={selectedGroup}
              attendanceDate={new Date()}
              isMultipleClasses={selectedClassroomGroups.length > 1}
              onAttendanceUpdated={(state) => {
                onAttendanceChange(state.listItems);
                validateAttendanceList(
                  selectedGroup.id ?? '',
                  state.listItems,
                  isPrimaryList
                );
              }}
              id={`attendance-list${selectedGroup.id}`}
            />
          </div>
        );
      })}
      <div className="mx-4 mb-4">
        <Typography
          type="h4"
          text={replaceBraces(questions[1].question, name)}
          color="textDark"
          className="mb-2"
        />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          selectedOptions={
            questions[1].answer !== ''
              ? Boolean(questions[1].answer)
              : undefined
          }
          onOptionSelected={(value) => onOptionSelected(value, 1)}
        />
        {questions[1].answer !== '' && (
          <Alert
            className="mt-4"
            type="success"
            title={`All steps complete - your signature and ${name}’s signature have been added.`}
            list={[
              `Please let ${name} know that their signature has been attached.`,
            ]}
          />
        )}
      </div>
    </>
  );
};
