import { SectionQuestions } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { PractitionerDto, useDialog } from '@ecdlink/core';
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
import { traineeSelectors } from '@/store/trainee';
import PositiveBonusEmoticon from '../../../../../../../../../assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { coachThunkActions } from '@/store/coach';

interface SmartSpaceCheck1Props {
  practitioner: PractitionerDto;
  programmeName: string | undefined | null;
  setSectionQuestions: (value?: SectionQuestions[]) => void;
  handleNextSection: any;
  saveSmartSpaceCheckData: () => void;
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
  practitioner,
  programmeName,
  setSectionQuestions,
  handleNextSection,
  saveSmartSpaceCheckData,
}) => {
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const isTrainee = practitioner?.isTrainee;
  const [enableButton, setEnableButton] = useState(false);
  const visitData = useSelector(traineeSelectors.getCoachSmartSpaceVisitData);
  const visitData1Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceSection1VisitDataCount
  );
  const visitData2Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceSection2VisitDataCount
  );

  const coachSmartSpaceVisit1DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceVisit1DataNotAttendedStandards
  );
  const coachSmartSpaceVisit1DataNotAttendedStandardsFormatted =
    coachSmartSpaceVisit1DataNotAttendedStandards?.length! > 0
      ? coachSmartSpaceVisit1DataNotAttendedStandards?.map((item: any) => {
          return item?.question;
        })
      : [];

  const coachSmartSpaceVisit2DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceVisit2DataNotAttendedStandards
  );
  const coachSmartSpaceVisit2DataNotAttendedStandardsFormatted =
    coachSmartSpaceVisit2DataNotAttendedStandards?.length! > 0
      ? coachSmartSpaceVisit2DataNotAttendedStandards?.map((item: any) => {
          return item?.question;
        })
      : [];

  const question =
    'Together with the SmartStarter, agree on what next steps can be taken and note them here:';
  const [questions, setAnswers] = useState([
    {
      question:
        'Together with the SmartStarter, agree on what next steps can be taken and note them here:',
      answer: '',
    },
  ]);

  const visitSection = `Discuss next steps`;
  const allStandardsAttended = useMemo(
    () =>
      Number(visitData1Completed) === 17 && Number(visitData2Completed) === 5,
    [visitData1Completed, visitData2Completed]
  );

  useEffect(() => {
    if (isTrainee) {
      const previousData = questions.map((item) => {
        const previousAnswer = visitData?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        });

        if (previousAnswer) {
          return {
            ...item,
            answer: previousAnswer?.questionAnswer!,
          };
        }

        return item;
      });
      setSectionQuestions?.([
        {
          visitSection,
          questions: previousData,
        },
      ]);

      setAnswers(previousData as QuestionAnswersProps[]);
      return;
    }

    const previousData = questions.map((item) => {
      const visitDataWithoutTypo = visitData as any;
      const previousAnswer = visitDataWithoutTypo
        ?.find((item: any) => {
          const sectionData = item?.visitSection === visitSection;
          return sectionData;
        })
        ?.questions.filter((obj: any) => {
          return obj.question === item.question;
        });

      const previousHasTrueAnswer = previousAnswer?.find(
        (item: any) =>
          item?.answer !== '' || Boolean(item?.answer) !== undefined
      );

      if (previousAnswer) {
        setEnableButton(true);
        return {
          ...item,
          answer: previousHasTrueAnswer?.answer,
        };
      }
      return item;
    });

    setSectionQuestions?.([
      {
        visitSection,
        questions: previousData,
      },
    ]);

    setAnswers(previousData);
  }, []);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setSectionQuestions?.([
        { visitSection, questions: [{ answer: value, question }] },
      ]);

      if (value !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [setSectionQuestions, visitSection]
  );

  const declineSmartSpaceLicence = useCallback(async () => {
    await dispatch(
      coachThunkActions.declineSmartSpaceLicenseForTrainee({
        userId: practitioner?.userId!,
        dateDeclined: new Date(),
        nextStepsComments: questions[0].answer,
      })
    );
  }, [dispatch, practitioner?.userId, questions]);

  const exitCoachSmartSpaceVisit = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
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
                onSubmit();
              },
              disabled: true,
              leadingIcon: 'CalendarIcon',
            },
            {
              text: 'Do this later',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: async () => {
                await declineSmartSpaceLicence();
                await onCancel();
                history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
                  practitionerId: practitioner?.userId,
                });
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog, history]);

  const renderButton = useMemo(() => {
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
                  handleNextSection();
                  saveSmartSpaceCheckData();
                }}
                disabled={
                  (!enableButton || Number(visitData1Completed) < 17) &&
                  !isTrainee
                }
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
              onClick={
                isTrainee
                  ? () => {
                      saveSmartSpaceCheckData();
                      handleNextSection();
                    }
                  : () => {
                      saveSmartSpaceCheckData();
                      exitCoachSmartSpaceVisit();
                    }
              }
              disabled={!enableButton && !isTrainee}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography
                type={'help'}
                text={isTrainee ? 'Next' : 'Save & next'}
                color={'white'}
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    enableButton,
    exitCoachSmartSpaceVisit,
    handleNextSection,
    isTrainee,
    saveSmartSpaceCheckData,
    visitData1Completed,
  ]);

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
        label={question}
        placeholder={'e.g. create a list of emergency numbers'}
        value={questions[0].answer}
        onChange={onChange}
        disabled={isTrainee}
      />

      {(Number(visitData1Completed) < 17 ||
        visitData1Completed === undefined) &&
        !isTrainee && (
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
      {renderButton}
    </div>
  );
};
