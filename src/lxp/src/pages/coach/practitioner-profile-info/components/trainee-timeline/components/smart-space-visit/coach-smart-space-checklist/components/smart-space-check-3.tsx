import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { CalendarAddEventInfo } from '@/pages/calendar/components/calendar-add-event/calendar-add-event.types';
import { PractitionerDto, useDialog, CalendarEventModel } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  Card,
  Colours,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  traineeActions,
  traineeSelectors,
  traineeThunkActions,
} from '@/store/trainee';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { coachSelectors, coachThunkActions } from '@/store/coach';
import { authSelectors } from '@/store/auth';
import { addDays, addMinutes } from 'date-fns';
import { UpdateVisitPlannedVisitDateModelInput } from '@ecdlink/graphql';
import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';

interface SmartSpaceCheck1Props {
  coachSmartSpaceVisitId: string;
  practitioner: PractitionerDto;
  saveSmartSpaceCheckData: (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => void;
  handleNextSection: () => void;
  onSubmit: () => void;
  setNotificationStep: (value: string) => void;
}

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 17) {
    return 'alertMain';
  }

  return 'successMain';
};

export interface QuestionAnswersProps {
  question: string;
  answer: string;
}

export const SmartSpaceCheck3: React.FC<SmartSpaceCheck1Props> = ({
  coachSmartSpaceVisitId,
  practitioner,
  handleNextSection,
  saveSmartSpaceCheckData,
  onSubmit,
  setNotificationStep,
}) => {
  const visitSection = `Discuss next steps`;

  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(authSelectors.getAuthUser);
  const isCoach = coach?.user?.id === user?.id;
  const [enableButton, setEnableButton] = useState(false);
  const practitionerUserId = practitioner?.userId || '';

  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitionerUserId)
  );
  const visitId: string = timeline?.sSCoachVisitId || '';
  const visitEventId: string = timeline?.sSCoachVisitEventId || '';
  const plannedVisitDate: string = timeline?.sSCoachVisitDate || '';
  const calendarAddEvent = useCalendarAddEvent();

  const visitData = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionAnswers(
      coachSmartSpaceVisitId,
      visitSection
    )
  );
  const visitData1Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionScore(visitId, 'SmartSpace check')
  );
  const visitData2Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionScore(
      visitId,
      'Additional standards'
    )
  );

  const coachSmartSpaceVisit1DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionFailedQuestions(
      visitId,
      'SmartSpace check'
    )
  );

  const coachSmartSpaceVisit1DataNotAttendedStandardsFormatted =
    coachSmartSpaceVisit1DataNotAttendedStandards?.length! > 0
      ? coachSmartSpaceVisit1DataNotAttendedStandards?.map((item: any) => {
          return item?.question;
        })
      : [];

  const coachSmartSpaceVisit2DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionFailedQuestions(
      visitId,
      'Additional standards'
    )
  );
  const coachSmartSpaceVisit2DataNotAttendedStandardsFormatted =
    coachSmartSpaceVisit2DataNotAttendedStandards?.length! > 0
      ? coachSmartSpaceVisit2DataNotAttendedStandards?.map((item: any) => {
          return item?.question;
        })
      : [];

  const [questions, setAnswers] = useState<SmartSpaceVisitData[]>([
    {
      visitSection: visitSection,
      question:
        'Together with the SmartStarter, agree on what next steps can be taken and note them here:',
      questionAnswer: '',
    },
  ]);

  const allStandardsAttended = useMemo(
    () =>
      Number(visitData1Completed) === 17 && Number(visitData2Completed) === 5,
    [visitData1Completed, visitData2Completed]
  );

  useEffect(() => {
    if (!!visitData && !!visitData.length) {
      setAnswers(visitData);
    }
  }, []);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    setAnswers([
      {
        ...questions[0],
        questionAnswer: value,
      },
    ]);

    if (value !== '') {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const onSchedule = () => {
    const today = addDays(new Date(), 1);
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours(),
      0,
      0,
      0
    );
    const event: CalendarAddEventInfo = !!visitEventId
      ? {
          id: visitEventId,
        }
      : {
          id: '',
          eventType: 'SmartSpace',
          allDay: false,
          start: start.toISOString(),
          end: addMinutes(start, 30).toISOString(),
          minDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).toISOString(),
          maxDate: new Date(plannedVisitDate).toISOString(),
          name: '',
          description: '',
          participantUserIds: [practitionerUserId],
          action: {
            buttonName: 'Start visit',
            buttonIcon: 'ArrowCircleRightIcon',
            url: ROUTES.COACH_SMARTSPACE_CHECK,
            state: {
              practitionerUserId: practitioner?.userId || '',
            },
          },
        };

    calendarAddEvent({
      event,
      onUpdated: (isNew: boolean, event: CalendarEventModel) => {
        const payload: UpdateVisitPlannedVisitDateModelInput = {
          visitId: visitId,
          plannedVisitDate: event.start,
          eventId: event.id,
        };
        dispatch(
          traineeActions.updateTraineeOnboardTimelineSSVisitEvent(payload)
        );
        dispatch(
          traineeThunkActions.updateTraineeOnboardTimelineSSVisitEvent(payload)
        );
        saveSmartSpaceCheckData(questions, visitSection);
        onSubmit();
        history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
          practitionerId: practitioner?.userId,
        });
      },
      onCancel: () => {},
    });
  };

  // TODO - figure out why this only works the second time it gets opened...
  const exitCoachSmartSpaceVisit = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onCancel) => (
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Schedule a follow up visit with ${practitioner?.user?.firstName}`}
          detailText={`Encourage ${practitioner?.user?.firstName} to work on the next steps and agree on a date & time for a follow-up visit now.`}
          actionButtons={[
            {
              text: 'Go to calendar',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSchedule();
              },
              disabled: !visitId,
              leadingIcon: 'CalendarIcon',
            },
            {
              text: 'Do this later',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: async () => {
                history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
                  practitionerId: practitioner?.userId,
                });
                await onCancel();
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  const renderButton = () => {
    if (Number(visitData1Completed) === 17) {
      return (
        <div className="mt-2 space-y-4">
          <div>
            <div>
              <Button
                type="filled"
                color="primary"
                className="mt-1 mb-2 w-full"
                onClick={() => {
                  if (isCoach) {
                    saveSmartSpaceCheckData(questions, visitSection);
                  }
                  handleNextSection();
                }}
                disabled={!enableButton && isCoach}
              >
                {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                <Typography type={'help'} text={'Next'} color={'white'} />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-2 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                if (!isCoach) {
                  setNotificationStep('');
                } else {
                  saveSmartSpaceCheckData(questions, visitSection);
                  onSubmit();
                  exitCoachSmartSpaceVisit();
                }
              }}
              disabled={!enableButton && isCoach}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography
                type={'help'}
                text={isCoach ? 'Save & exit' : 'Exit'}
                color={'white'}
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={visitSection}
        color={'textDark'}
        className={'my-3'}
      />
      <Divider dividerType="dashed" className={'my-4'} />

      {(Number(visitData1Completed) < 17 ||
        visitData1Completed === undefined) && (
        <Alert
          className={'mt-5 mb-3'}
          title={`${practitioner?.user?.firstName}'s venue does not meet the basic SmartSpace standards. She is still working on:`}
          list={coachSmartSpaceVisit1DataNotAttendedStandardsFormatted || []}
          type={'warning'}
        />
      )}

      {((Number(visitData2Completed) < 5 &&
        Number(visitData1Completed) === 17) ||
        (!visitData2Completed && Number(visitData1Completed) === 17)) && (
        <Card className="bg-uiBg rounded-2xl p-4">
          <Typography
            type={'body'}
            weight="bold"
            text={`${practitioner?.user?.firstName}'s venue meets all the basic SmartSpace standards. They are working towards these additional standards:`}
            color={'textDark'}
            className={'my-3'}
          />
          {coachSmartSpaceVisit2DataNotAttendedStandardsFormatted?.map(
            (item) => {
              return (
                <Typography
                  type={'body'}
                  text={`• ${item}`}
                  color={'textMid'}
                  className={'my-3'}
                />
              );
            }
          )}
        </Card>
      )}

      {allStandardsAttended && (
        <div>
          <div className="bg-successMain mt-4 flex flex-row flex-nowrap items-center rounded-lg p-4">
            <div className="rounded-full p-4">
              <img
                className={'h-14 w-32'}
                src={PositiveBonusEmoticon}
                alt="complete"
              />
            </div>
            <div>
              <Typography
                className={'w-full p-2'}
                type={'body'}
                color={'white'}
                text={`${practitioner?.user?.firstName}’s venue meets all the basic SmartSpace standards as well as the additional standards!`}
              />
            </div>
          </div>
        </div>
      )}
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={questions[0].question}
        placeholder={'e.g. create a list of emergency numbers'}
        value={questions[0].questionAnswer}
        onChange={onChange}
        disabled={!isCoach}
      />

      {(Number(visitData1Completed) < 17 ||
        visitData1Completed === undefined) &&
        isCoach && (
          <Alert
            className={'mt-5 mb-3'}
            title={`You cannot issue ${practitioner?.user?.firstName}'s SmartSpace Licence.`}
            list={[
              `Discuss ways that ${practitioner?.user?.firstName} can prepare for the next SmartSpace visit.`,
              `Schedule a follow-up visit with ${practitioner?.user?.firstName}.`,
            ]}
            type={'error'}
          />
        )}
      {renderButton()}
    </div>
  );
};
