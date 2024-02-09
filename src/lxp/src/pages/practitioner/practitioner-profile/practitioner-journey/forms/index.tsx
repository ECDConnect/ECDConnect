import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DynamicForm,
  DynamicFormProps,
  SectionQuestions,
} from './dynamic-form';
import { useSelector } from 'react-redux';
import { getUser } from '@/store/user/user.selectors';
import {
  pqaSteps,
  prePqaSteps,
  reAccreditationSteps,
  requestCoachingVisitOrCallSteps,
  selfAssessmentSteps,
  supportVisitSteps,
} from './steps';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  parseBool,
  useDialog,
  usePrevious,
  useSessionStorage,
  useSnackbar,
} from '@ecdlink/core';
import { visitTypes } from '../index.types';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  VisitModelInput,
} from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  PqaActions,
  addCoachVisitInviteForPractitioner,
} from '@/store/pqa/pqa.actions';
import { visitTypes as coachVisitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import {
  getFirstPqaSteps,
  getReAccreditationSteps,
} from '@/pages/coach/coach-practitioner-journey/forms/steps';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { step11VisitSection } from '@/pages/coach/coach-practitioner-journey/forms/pqa-visits/first-pqa';
import { step2ReAccreditationVisitSection } from '@/pages/coach/coach-practitioner-journey/forms/reaccreditation';
import { options } from '@/pages/coach/coach-practitioner-journey/forms/reaccreditation/step-2/options';
import { getCoach } from '@/store/coach/coach.selectors';
import {
  callType,
  question1,
  question2,
} from './request-coaching-visit-or-call/constants';
import { OfflineStep } from './offline';
import { newGuid } from '@/utils/common/uuid.utils';

export const practitionerVisitIdKey = 'practitionerVisitId';
export const currentActivityKey = 'practitionerSelectedFormOption';
export const isViewKey = 'practitionerIsView';

interface FormProps {
  onBack: () => void;
}

export const Form = ({ onBack }: FormProps) => {
  const [isSecondaryPage, setIsSecondaryPage] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [isViewDetails, setIsViewDetails] = useState(false);

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_VISIT_FORM_DATA
  );
  const {
    isLoading: isLoadingCoachRequest,
    isRejected: isRejectedCoachRequest,
  } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_COACH_VISIT_INVITE_FOR_PRACTITIONER
  );
  const wasLoading = usePrevious(isLoading);
  const wasLoadingCoachRequest = usePrevious(isLoadingCoachRequest);

  const { showMessage } = useSnackbar();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');
  const isViewPqaOrReAccreditation =
    (activityName.includes(coachVisitTypes.pqa.includes) ||
      activityName.includes(coachVisitTypes.reaccreditation.includes)) &&
    !activityName.includes(coachVisitTypes.prePqa.includes) &&
    !activityName.includes(coachVisitTypes.pqa.followUp.name) &&
    !activityName.includes(coachVisitTypes.reaccreditation.followUp.name);
  const isRequestCoachingVisitOrCall = activityName.includes(
    visitTypes.requestCoachingVisitOrCall.name
  );

  const [visitId] = useSessionStorage(practitionerVisitIdKey);

  const coach = useSelector(getCoach);

  const step2PreviousData = useSelector(
    getSectionsQuestionsByStep(
      visitId ?? '',
      'reAccreditationPreviousFormData',
      step2ReAccreditationVisitSection
    )
  );
  const isStep2AllCompleted =
    String(step2PreviousData?.questions?.[0]?.answer)?.split('.,')?.length ===
    options.length;
  const previousDataPqaStep11 = useSelector(
    getSectionsQuestionsByStep(
      visitId ?? '',
      'pqaPreviousFormData',
      step11VisitSection
    )
  );

  const pqaStep11Answer =
    String(previousDataPqaStep11?.questions?.[0]?.answer) ?? undefined;

  const { isOnline } = useOnlineStatus();

  const user = useSelector(getUser);

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const currentSteps = useMemo(() => {
    const isPQA = activityName.includes(coachVisitTypes.pqa.includes);
    const isReAccreditation = activityName.includes(
      coachVisitTypes.reaccreditation.includes
    );

    if (!isOnline) {
      setTitle('You are offline');
      return [OfflineStep];
    }

    if (activityName.includes(visitTypes.requestCoachingVisitOrCall.name)) {
      setTitle(visitTypes.requestCoachingVisitOrCall.description);
      return requestCoachingVisitOrCallSteps;
    }
    if (activityName.includes(coachVisitTypes.prePqa.includes)) {
      setTitle('Pre-PQA site visits summary');
      return prePqaSteps;
    }
    if (activityName === coachVisitTypes.supportVisit.description) {
      setTitle(coachVisitTypes.supportVisit.description);
      return supportVisitSteps;
    }

    if (activityName.includes(coachVisitTypes.pqa.followUp.name)) {
      setTitle(coachVisitTypes.pqa.followUp.description);
      return supportVisitSteps;
    }

    if (isPQA && isViewDetails) {
      return getFirstPqaSteps({
        isToShowStep1: false,
        isStep11AnswerTrue: pqaStep11Answer === 'true',
        isToRemoveSmartStarter: false,
        isToShowStep17: false,
      });
    }

    if (isPQA) {
      setTitle('PQA site visits summary');
      return pqaSteps;
    }

    if (activityName.includes(coachVisitTypes.reaccreditation.followUp.name)) {
      setTitle(coachVisitTypes.pqa.followUp.description);
      return supportVisitSteps;
    }

    if (isReAccreditation && isViewDetails) {
      return getReAccreditationSteps({
        isToShowStep1: false,
        isToShowStep16: false,
        isToRemoveSmartStarter: false,
        isBasicSmartSpaceStandardsCompleted: isStep2AllCompleted,
      });
    }

    if (isReAccreditation) {
      setTitle('Reaccreditation summary');
      return reAccreditationSteps;
    }

    setTitle('Self-assessment');
    return selfAssessmentSteps;
  }, [
    isOnline,
    activityName,
    isStep2AllCompleted,
    isViewDetails,
    pqaStep11Answer,
  ]);

  const isHideSteps =
    (isView && currentSteps.length === 1) || isRequestCoachingVisitOrCall;

  const handleOnBack = useCallback(() => {
    if (isSecondaryPage) {
      return setIsSecondaryPage(false);
    }

    if (step === 0) {
      return onBack();
    }

    return setStep((prevState) => prevState - 1);
  }, [isSecondaryPage, onBack, step]);

  const handleOnNext = useCallback(() => {
    setStep((preState) => preState + 1);
  }, []);

  const handleOnClose = useCallback(() => {
    if (isView) {
      setIsViewDetails(false);
      return onBack();
    }

    return dialog({
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
  }, [dialog, isView, onBack]);

  const onView = () => {
    if (isViewDetails) {
      return handleOnClose();
    }
    setIsViewDetails(true);
  };

  const onSubmitSelfAssessment = async (
    payload: CmsVisitDataInputModelInput
  ) => {
    const syncId = newGuid();

    appDispatch(
      pqaActions.addVisitFormData(
        { syncId, ...payload },
        {
          userId: user?.id!,
          formType: 'self-assessment',
        }
      )
    );

    await appDispatch(pqaThunkActions.addVisitFormData({ syncId, ...payload }));
  };

  const onSubmitRequestCoachingVisitOrCall = async () => {
    const questions = sectionQuestions?.find((item) =>
      item.visitSection.includes(
        visitTypes.requestCoachingVisitOrCall.description
      )
    )?.questions;

    const payload: VisitModelInput = {
      practitionerId: user?.id,
      coachId: coach?.id,
      isSupportCall:
        questions?.find((item) => item.question.includes(question1))?.answer ===
        callType,
      comment: questions?.find((item) => item.question.includes(question2))
        ?.answer as string,
      attended: false,
      // TODO: Check these dates
      actualVisitDate: new Date(),
      plannedVisitDate: new Date(),
    };

    await appDispatch(addCoachVisitInviteForPractitioner(payload));
  };

  const handleOnSubmit = () => {
    if (isRequestCoachingVisitOrCall) {
      onSubmitRequestCoachingVisitOrCall();
    }

    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const payload: CmsVisitDataInputModelInput = {
      practitionerId: user?.id,
      visitId: visitId ?? '',
      visitData: {
        sections,
      },
    };

    if (activityName.includes(visitTypes.selfAssessment.includes)) {
      onSubmitSelfAssessment(payload);
    }
  };

  const renderSubmitButtonStyle =
    useMemo((): DynamicFormProps['submitButton'] => {
      if (isRequestCoachingVisitOrCall) {
        return {
          icon: 'PaperAirplaneIcon',
          text: 'Send request',
          type: 'filled',
        };
      }
      if (isView) {
        if (isViewPqaOrReAccreditation) {
          return { icon: 'EyeIcon', text: 'View details', type: 'filled' };
        }

        return { icon: 'XIcon', text: 'Close', type: 'outlined' };
      }

      return undefined;
    }, [isRequestCoachingVisitOrCall, isView, isViewPqaOrReAccreditation]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      onBack();
      showMessage({
        type: 'success',
        message: 'Self-assessment submitted successfully',
      });
    }
  }, [isLoading, onBack, showMessage, wasLoading]);

  useEffect(() => {
    if (wasLoadingCoachRequest && isRejectedCoachRequest) {
      showMessage({
        type: 'error',
        message: `Something went wrong. ${
          isOnline
            ? 'Please try again later'
            : 'Please check your internet connection and try again'
        } `,
      });
    }

    if (wasLoadingCoachRequest && !isRejectedCoachRequest) {
      onBack();
      showMessage({
        type: 'success',
        message: 'Request sent!',
      });
    }
  }, [
    isOnline,
    isRejectedCoachRequest,
    onBack,
    showMessage,
    wasLoadingCoachRequest,
  ]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={handleOnBack}
      onClose={handleOnClose}
      title={`${title || activityName}`}
      subTitle={isHideSteps ? '' : `step ${step + 1} of ${currentSteps.length}`}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <DynamicForm
        name={activityName}
        steps={currentSteps}
        smartStarter={user}
        isSecondaryPage={isSecondaryPage}
        currentStep={step}
        setIsSecondaryPage={setIsSecondaryPage}
        setSectionQuestions={setSectionQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
        onSubmit={handleOnSubmit}
        submitButton={renderSubmitButtonStyle}
        isLoading={isLoading || isLoadingCoachRequest}
        isView={isView}
        {...(isViewPqaOrReAccreditation && { onView })}
      />
    </BannerWrapper>
  );
};
