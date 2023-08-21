import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReasonsForPractitionerLeaving,
  chunkArray,
  parseBool,
  useDialog,
  usePrevious,
  useSnackbar,
} from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import {
  PractitionerJourneyParams,
  maxNumberOfVisits,
  visitTypes,
} from '../coach-practitioner-journey.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  delicensingSteps,
  generalSupportVisit,
  getFirstPqaSteps,
  prePqaVisits,
  getReAccreditationSteps,
} from './steps';
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  FollowUpVisitModelInput,
  InputMaybe,
  Maybe,
  PqaRating,
  SupportVisitModelInput,
} from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PqaActions, getVisitDataForVisitId } from '@/store/pqa/pqa.actions';
import { ReactComponent as IconRobot } from '@/assets/iconRobot.svg';
import { useAppDispatch } from '@/store';
import {
  callAnswer,
  visitOrCallQuestion,
} from './general-support-visit/coaching-visit-or-call/constants';
import {
  step11VisitSection,
  step16Question1,
  step16VisitSection,
  step19Question2Pqa,
} from './pqa-visits/first-pqa';
import {
  PractitionerActions,
  deActivatePractitioner,
  delicensePractitioner,
} from '@/store/practitioner/practitioner.actions';
import {
  delicensingQuestion2,
  delicensingStep1VisitSection,
} from './delicensing';
import { ChildrenDialog } from './dialog';
import {
  step15ReAccreditationQuestions,
  step15ReAccreditationVisitSection,
  step2ReAccreditationVisitSection,
} from './reaccreditation';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { options } from './reaccreditation/step-2/options';

interface SubmitProps {
  sections: InputMaybe<InputMaybe<CmsVisitSectionInput>[]>;
  payload: CmsVisitDataInputModelInput;
}

interface ExtraVisitProps extends SubmitProps {
  type:
    | 'support-visit'
    | 'pqa-follow-up-visit'
    | 're-accreditation-follow-up-visit';
}

export interface Rating {
  color: 'Success' | 'Warning' | 'Error';
  score: number;
}

interface FormProps {
  visitId?: string;
  onBack: () => void;
  setPqaRating?: (rating: Rating) => void;
  setReAccreditationRating?: (rating: Rating) => void;
}

export const currentActivityKey = 'selectedOption';
export const visitIdKey = 'visitId';
export const isViewKey = 'isView';
const sessionStorageKey = 'currentStepNumber';

export const Form = ({
  visitId,
  onBack,
  setReAccreditationRating: setReAccreditationRatingForm,
  setPqaRating: setPqaRatingForm,
}: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [currentActivity, setCurrentActivity] = useState('');
  const [title, setTitle] = useState('');
  const [pqaRating, setPqaRating] = useState<Rating | undefined>();
  const [reAccreditationRating, setReAccreditationRating] = useState<
    Rating | undefined
  >();

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const firstName = practitioner?.user?.firstName || 'the SmartStarter';
  const step16Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step16VisitSection)
    ?.questions.find((item) => item.question === step16Question1)?.answer;
  const step2ReAccreditationQuestionAnswers = sectionQuestions?.find(
    (item) => item.visitSection === step2ReAccreditationVisitSection
  )?.questions?.[0]?.answer as string[] | undefined;
  const isBasicSmartSpaceStandardsCompleted =
    step2ReAccreditationQuestionAnswers?.length === options.length;

  const step15ReAccreditationQuestion1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step15ReAccreditationVisitSection)
    ?.questions.find(
      (item) => item.question === step15ReAccreditationQuestions.question1
    )?.answer;

  const newPqaVisit = timeline?.pQASiteVisits?.find(
    (item) =>
      !item?.attended && item?.visitType?.name !== visitTypes.pqa.followUp.name
  );
  const newReAccreditationVisit = timeline?.reAccreditationVisits?.find(
    (item) =>
      !item?.attended &&
      item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
  );

  // All years
  const filteredReAccreditationRatings =
    timeline?.reAccreditationRatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationRatings = chunkArray<Maybe<PqaRating>>(
    filteredReAccreditationRatings,
    maxNumberOfVisits
  );
  const reAccreditationRatingsFromCurrentYear =
    subdividedReAccreditationRatings?.[
      subdividedReAccreditationRatings.length - 1
    ];

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  const reAccreditationRating1 = reAccreditationRatingsFromCurrentYear?.[0];
  const reAccreditationRating2 = reAccreditationRatingsFromCurrentYear?.[1];
  const reAccreditationRating3 = reAccreditationRatingsFromCurrentYear?.[2];

  const pqaRatingColorList = [
    pqaRating1?.overallRatingColor,
    pqaRating2?.overallRatingColor,
    pqaRating3?.overallRatingColor,
    pqaRating?.color,
  ];

  const reAccreditationRatingColorList = [
    reAccreditationRating1?.overallRatingColor,
    reAccreditationRating2?.overallRatingColor,
    reAccreditationRating3?.overallRatingColor,
    reAccreditationRating?.color,
  ];

  const pqaRatingRedColorCount = pqaRatingColorList.filter(
    (item) => item === 'Error'
  ).length;

  const reAccreditationRatingRedColorCount =
    reAccreditationRatingColorList.filter((item) => item === 'Error').length;

  const isToRemoveSmartStarter =
    step16Question1Answer === true ||
    step15ReAccreditationQuestion1Answer === true ||
    pqaRatingRedColorCount === 2 ||
    reAccreditationRatingRedColorCount === 2;

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingReAccreditationVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_RE_ACCREDITATION_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingSupportVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_SUPPORT_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingPqaFollowUpVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_FOLLOW_UP_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingReAccreditationFollowUpVisit } =
    useThunkFetchCall(
      'pqa',
      PqaActions.ADD_RE_ACCREDITATION_FOLLOW_UP_VISIT_FORM_DATA
    );

  const { isLoading: isLoadingDeactivate, isRejected } = useThunkFetchCall(
    'practitioner',
    PractitionerActions.DEACTIVATE_PRACTITIONER
  );

  const wasLoadingDeactivate = usePrevious(isLoadingDeactivate);

  const isStep11AnswerTrue =
    sectionQuestions?.find((item) => item.visitSection === step11VisitSection)
      ?.questions[0].answer === true;

  const handleOnClose = useCallback(() => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            iconClassName="h-10 w-10"
            title="Are you sure you want to exit?"
            detailText="If you exit now you will lose your progress."
            actionButtons={[
              {
                colour: 'primary',
                text: 'Exit',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'LoginIcon',
                onClick: () => {
                  window.sessionStorage.removeItem(sessionStorageKey);
                  onClose();
                  onBack();
                },
              },
              {
                colour: 'primary',
                text: 'Continue editing',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'PencilIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog, onBack]);

  const setRatingStep = useCallback(() => {
    const stepsLength = getFirstPqaSteps({
      isToShowStep1: true,
      isStep11AnswerTrue,
      isToRemoveSmartStarter,
      isToShowStep17: true,
    }).length;

    if (stepsLength <= 16) {
      setStep(13);
    } else {
      setStep(16);
    }
  }, [isStep11AnswerTrue, isToRemoveSmartStarter]);

  const handleOnBack = useCallback(() => {
    if (currentActivity === visitTypes.delicensing && step === 0) {
      setRatingStep();
      return setCurrentActivity(visitTypes.pqa.firstPQA.name);
    }
    if (isTip) {
      return setIsTip(false);
    }

    if (step === 0) {
      return onBack();
    }

    return setStep((prevState) => prevState - 1);
  }, [currentActivity, isTip, onBack, setRatingStep, step]);

  const handleOnNext = useCallback(() => {
    setStep((preState) => preState + 1);
  }, []);

  const displayChildrenDialog = useCallback(
    (name: string) => {
      dialog({
        blocking: false,
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => (
          <ChildrenDialog
            name={firstName}
            onClose={onClose}
            onSuccess={() => showMessage({ message: `${name} complete!` })}
            practitionerId={practitionerId}
            onBack={onBack}
          />
        ),
      });
    },
    [dialog, firstName, practitionerId, onBack, showMessage]
  );

  const displayOfflineWarning = useCallback(() => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            customIcon={<IconRobot className="mb-4" />}
            title={`Data has been saved in offline mode`}
            detailText={`In order for you to view the answers, it is necessary to synchronize your account.`}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog]);

  const onSubmitSupportVisit = useCallback(
    async (
      payload: CmsVisitDataInputModelInput,
      visitType?: InputMaybe<string>
    ) => {
      appDispatch(
        pqaActions.addVisitFormData(payload, {
          userId: practitionerId,
          formType: 'support-visit',
        })
      );
      await appDispatch(pqaThunkActions.addSupportVisitFormData(payload));
      onBack?.();
      showMessage({
        message: `${
          visitType === callAnswer ? 'Support call' : 'Support visit'
        } complete!`,
      });
      if (!isOnline) {
        setTimeout(() => displayOfflineWarning(), 300);
      }
    },
    [
      appDispatch,
      displayOfflineWarning,
      isOnline,
      onBack,
      practitionerId,
      showMessage,
    ]
  );

  const onSubmitFollowUpVisit = useCallback(
    async (
      payload: CmsVisitDataInputModelInput,
      type: 'pqa' | 're-accreditation'
    ) => {
      if (type === 'pqa') {
        appDispatch(
          pqaActions.addVisitFormData(payload, {
            userId: practitionerId,
            formType: 'follow-up-visit',
          })
        );
        await appDispatch(
          pqaThunkActions.addFollowUpVisitForPractitioner(payload)
        );
        // TODO: check if it is needed
        // window.sessionStorage.setItem(
        //   currentActivityKey,
        //   visitTypes.pqa.firstPQA.name
        // );
        // setCurrentActivity(visitTypes.pqa.firstPQA.name);
      }

      if (type === 're-accreditation') {
        appDispatch(
          pqaActions.addVisitFormData(payload, {
            userId: practitionerId,
            formType: 'follow-up-visit',
          })
        );
        await appDispatch(
          pqaThunkActions.addReAccreditationFollowUpVisitForPractitioner(
            payload
          )
        );
      }

      onBack?.();
    },
    [appDispatch, onBack, practitionerId]
  );

  const handleSubmitExtraVisit = useCallback(
    ({ payload, sections, type }: ExtraVisitProps) => {
      const visitOrCallSection = sections?.find((item) =>
        item?.questions?.some(
          (question) => question?.question === visitOrCallQuestion
        )
      )?.questions;
      const visitOrCallAnswer = visitOrCallSection?.find(
        (item) => item?.question === visitOrCallQuestion
      )?.answer;

      const supportPayload: SupportVisitModelInput = {
        practitionerId,
        // TODO: add schedule option
        plannedVisitDate: new Date(),
        isSupportCall: visitOrCallAnswer === callAnswer,
        // TODO: add schedule option
        attended: true,
        supportData: payload,
      };

      const followUpPayload: FollowUpVisitModelInput = {
        practitionerId,
        // TODO: add schedule option
        plannedVisitDate: new Date(),
        // TODO: add schedule option
        attended: true,
        linkedVisitId:
          type === 'pqa-follow-up-visit'
            ? newPqaVisit?.id
            : newReAccreditationVisit?.id,
        followUpData: payload,
      };

      if (type === 'support-visit') {
        return onSubmitSupportVisit(supportPayload, visitOrCallAnswer);
      }

      if (type === 'pqa-follow-up-visit') {
        return onSubmitFollowUpVisit(followUpPayload, 'pqa');
      }

      if (type === 're-accreditation-follow-up-visit') {
        return onSubmitFollowUpVisit(followUpPayload, 're-accreditation');
      }
    },
    [
      practitionerId,
      newPqaVisit?.id,
      newReAccreditationVisit,
      onSubmitSupportVisit,
      onSubmitFollowUpVisit,
    ]
  );

  const onSubmitPrePqa = useCallback(
    async ({ payload }: SubmitProps) => {
      appDispatch(
        pqaActions.addVisitFormData(payload, {
          userId: practitionerId,
          formType: 'pre-pqa',
        })
      );
      await appDispatch(pqaThunkActions.addVisitFormData(payload));
      displayChildrenDialog(
        activityName === visitTypes.prePqa.first.name
          ? 'First site visit'
          : 'Second site visit'
      );
    },
    [activityName, appDispatch, displayChildrenDialog, practitionerId]
  );

  const onSubmitPqa = useCallback(
    async ({ payload, sections }: SubmitProps) => {
      const step19Question2 = sections?.find((item) =>
        item?.questions?.some(
          (question) => question?.question === step19Question2Pqa
        )
      )?.questions;
      const step19Question2Answer = step19Question2?.find(
        (item) => item?.question === step19Question2Pqa
      )?.answer;

      appDispatch(
        pqaActions.addVisitFormData(payload, {
          userId: practitionerId,
          formType: 'pqa',
        })
      );
      // Create a new ID if it doesn't already exist
      await appDispatch(
        pqaThunkActions.addVisitFormData({
          ...payload,
          visitId: visitId,
        })
      );

      if (step19Question2Answer === 'true') {
        return displayChildrenDialog('First PQA visit');
      }

      showMessage({ message: 'First PQA visit complete!' });
      onBack();
    },
    [
      appDispatch,
      displayChildrenDialog,
      practitionerId,
      showMessage,
      visitId,
      onBack,
    ]
  );

  const onSubmitReAccreditation = useCallback(
    async ({ payload }: SubmitProps) => {
      appDispatch(
        pqaActions.addVisitFormData(payload, {
          userId: practitionerId,
          formType: 're-accreditation',
        })
      );
      await appDispatch(pqaThunkActions.addVisitFormData(payload));

      if (isToRemoveSmartStarter) return;

      if (!isBasicSmartSpaceStandardsCompleted) {
        // TODO: add schedule feature
        return onBack?.();
      }

      showMessage({ message: 'Re-accreditation complete!' });
      onBack();
    },
    [
      appDispatch,
      isBasicSmartSpaceStandardsCompleted,
      isToRemoveSmartStarter,
      onBack,
      practitionerId,
      showMessage,
    ]
  );

  const onSubmit = useCallback(() => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const payload: CmsVisitDataInputModelInput = {
      visitId,
      practitionerId,
      visitData: {
        visitName: activityName,
        sections,
      },
    };

    if (activityName === visitTypes.supportVisit) {
      return handleSubmitExtraVisit({
        payload,
        sections,
        type: 'support-visit',
      });
    }

    if (activityName === visitTypes.pqa.followUp.name) {
      return handleSubmitExtraVisit({
        payload,
        sections,
        type: 'pqa-follow-up-visit',
      });
    }

    if (activityName === visitTypes.reaccreditation.followUp.name) {
      return handleSubmitExtraVisit({
        payload,
        sections,
        type: 're-accreditation-follow-up-visit',
      });
    }

    if (activityName.includes(visitTypes.prePqa.includes)) {
      return onSubmitPrePqa({ payload, sections });
    }

    if (activityName.includes(visitTypes.reaccreditation.includes)) {
      return onSubmitReAccreditation({ payload, sections });
    }

    return onSubmitPqa({ payload, sections });
  }, [
    activityName,
    onSubmitPqa,
    onSubmitPrePqa,
    onSubmitReAccreditation,
    handleSubmitExtraVisit,
    practitionerId,
    sectionQuestions,
    visitId,
  ]);

  const onSubmitDelicensing = () => {
    const leavingComment = sectionQuestions
      ?.find((item) => item.visitSection === delicensingStep1VisitSection)
      ?.questions?.find((item) => item.question === delicensingQuestion2)
      ?.answer as string | undefined;

    const collectedDocsQuestions = sectionQuestions
      ?.find((item) => item.visitSection === delicensingStep1VisitSection)
      ?.questions?.find((item) =>
        item.question.endsWith(
          'to return the items below and confirm that you have received them.'
        )
      )?.answer as string[] | [];

    const collectedSSPlaykit = collectedDocsQuestions.some((answer) =>
      answer.endsWith('SmartStart playkit')
    );
    const collectedSSHandbook = collectedDocsQuestions.some((answer) =>
      answer.endsWith('SmartStart handbook')
    );

    if (!!practitioner?.userId) {
      appDispatch(
        deActivatePractitioner({
          userId: practitioner?.userId,
          reasonForPractitionerLeavingId:
            ReasonsForPractitionerLeaving.DELICENSED,
          leavingComment,
        })
      );
      appDispatch(
        delicensePractitioner({
          userId: practitioner?.userId,
          delicensedDate: new Date(),
          delicensedComment: leavingComment,
          collectedSSHandbook,
          collectedSSPlaykit,
        })
      );
    }
  };

  const handleOnSubmit = () => {
    if (isToRemoveSmartStarter && step !== 1) {
      setStep(0);
      setCurrentActivity(visitTypes.delicensing);
    }

    if (currentActivity === visitTypes.delicensing) {
      return onSubmitDelicensing();
    }

    return onSubmit();
  };

  const onCancelDelicensing = () => {
    setRatingStep();
    setCurrentActivity(visitTypes.pqa.firstPQA.name);
  };

  const visitName = currentActivity || activityName;
  const currentSteps = useMemo(() => {
    if (
      visitName === visitTypes.supportVisit ||
      visitName.includes(visitTypes.pqa.followUp.name) ||
      visitName.includes(visitTypes.reaccreditation.followUp.name)
    ) {
      if (activityName === visitTypes.supportVisit) {
        setTitle(visitTypes.supportVisit);
      } else if (activityName === visitTypes.reaccreditation.followUp.name) {
        setTitle(visitTypes.reaccreditation.followUp.description);
      } else {
        setTitle(visitTypes.pqa.followUp.description);
      }

      return generalSupportVisit;
    }

    if (visitName === visitTypes.delicensing) {
      return delicensingSteps;
    }

    if (visitName.includes(visitTypes.prePqa.includes)) {
      if (activityName === visitTypes.prePqa.first.name) {
        setTitle(visitTypes.prePqa.first.description);
      } else {
        setTitle(visitTypes.prePqa.second.description);
      }

      return prePqaVisits;
    }

    if (visitName.includes(visitTypes.reaccreditation.includes)) {
      setTitle('Reaccreditation');
      return getReAccreditationSteps({
        isToShowStep1: true,
        isToShowStep16: true,
        isToRemoveSmartStarter,
        isBasicSmartSpaceStandardsCompleted,
      });
    }

    setTitle(visitTypes.pqa.firstPQA.description);
    return getFirstPqaSteps({
      isToShowStep1: true,
      isStep11AnswerTrue,
      isToRemoveSmartStarter,
      isToShowStep17: true,
    });
  }, [
    activityName,
    isBasicSmartSpaceStandardsCompleted,
    isStep11AnswerTrue,
    isToRemoveSmartStarter,
    visitName,
  ]);

  const onSetPqaRating = (rating: Rating) => {
    if (rating.score === pqaRating?.score) return;

    setPqaRating(rating);
    setPqaRatingForm?.(rating);
  };

  const onSetReAccreditationRating = (rating: Rating) => {
    if (rating.score === reAccreditationRating?.score) return;

    setReAccreditationRatingForm?.(rating);
    setReAccreditationRating(rating);
  };

  const getSelfAssessment = useCallback(async () => {
    const attendedSelfAssessments = timeline?.selfAssessmentVisits?.filter(
      (item) => item?.attended
    );
    const selfAssessmentVisit =
      attendedSelfAssessments?.[attendedSelfAssessments.length - 1];

    if (!selfAssessmentVisit) return;

    await appDispatch(
      getVisitDataForVisitId({
        visitId: selfAssessmentVisit?.id,
        visitType: 'self-assessment',
      })
    );
  }, [appDispatch, timeline?.selfAssessmentVisits]);

  useEffect(() => {
    getSelfAssessment();
  }, [getSelfAssessment]);

  useEffect(() => {
    if (wasLoadingDeactivate && !isLoadingDeactivate) {
      if (isRejected) {
        return showMessage({
          message: `Something went wrong, please try again`,
          type: 'error',
        });
      }

      onBack?.();
      showMessage({ message: 'SmartStarter removed' });
    }
  }, [
    isLoadingDeactivate,
    isRejected,
    onBack,
    showMessage,
    wasLoadingDeactivate,
  ]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={handleOnBack}
      onClose={handleOnClose}
      title={`${title || activityName} - ${practitioner?.user?.firstName} ${
        practitioner?.user?.surname
      }`}
      subTitle={`step ${step + 1} of ${currentSteps.length}`}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <DynamicForm
        isView={isView}
        name={activityName}
        steps={currentSteps}
        smartStarter={practitioner}
        isTipPage={isTip}
        currentStep={step}
        pqaRating={pqaRating}
        reAccreditationRating={reAccreditationRating}
        nextButtonText={
          step === 10 && isStep11AnswerTrue
            ? 'Continue to SmartSpace checklist'
            : 'Next'
        }
        setIsTip={setIsTip}
        setSectionQuestions={setSectionQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
        onSubmit={handleOnSubmit}
        submitButton={
          !isBasicSmartSpaceStandardsCompleted
            ? { text: 'Save & next', icon: 'SaveIcon' }
            : undefined
        }
        setPqaRating={onSetPqaRating}
        setReAccreditationRating={onSetReAccreditationRating}
        isLoading={
          isLoading ||
          isLoadingSupportVisit ||
          isLoadingDeactivate ||
          isLoadingPqaFollowUpVisit ||
          isLoadingReAccreditationVisit ||
          isLoadingReAccreditationFollowUpVisit
        }
        secondaryButton={
          visitName === visitTypes.delicensing && step === 1
            ? { icon: 'XIcon', text: 'Cancel', onClick: onCancelDelicensing }
            : undefined
        }
        {...(visitName === visitTypes.delicensing && {
          submitButton: {
            text: 'Remove SmartStarter',
            icon: 'TrashIcon',
          },
        })}
        // TODO: add schedule integration
        {...(visitName === visitTypes.pqa.followUp.name && {
          submitButton: {
            text: 'Save',
            icon: 'ArrowCircleRightIcon',
          },
        })}
      />
    </BannerWrapper>
  );
};
