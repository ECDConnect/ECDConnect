import { useCallback, useMemo, useState } from 'react';
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
  selfAssessmentSteps,
  supportVisitSteps,
} from './steps';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { parseBool, useDialog, useSessionStorage } from '@ecdlink/core';
import { visitTypes } from '../index.types';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SupportVisitModelInput,
} from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PqaActions } from '@/store/pqa/pqa.actions';
import { visitTypes as coachVisitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import {
  getFirstPqaSteps,
  getReAccreditationSteps,
} from '@/pages/coach/coach-practitioner-journey/forms/steps';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { step11VisitSection } from '@/pages/coach/coach-practitioner-journey/forms/pqa-visits/first-pqa';

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

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');
  const isViewPqaOrReAccreditation =
    (activityName.includes(coachVisitTypes.pqa.includes) ||
      activityName.includes(coachVisitTypes.reaccreditation.includes)) &&
    !activityName.includes(coachVisitTypes.prePqa.includes);

  const [visitId] = useSessionStorage(practitionerVisitIdKey);

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitId ?? '',
      'pqaPreviousFormData',
      step11VisitSection
    )
  );

  const pqaStep11Answer =
    String(previousData?.questions?.[0]?.answer) ?? undefined;

  const { isLoading: isLoadingSelfAssessment } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_SELF_ASSESSMENT_FOR_PRACTITIONER
  );
  const { isOnline } = useOnlineStatus();

  const user = useSelector(getUser);

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const currentSteps = useMemo(() => {
    const isPQA = activityName.includes(coachVisitTypes.pqa.includes);
    const isReAccreditation = activityName.includes(
      coachVisitTypes.reaccreditation.includes
    );

    if (activityName.includes(coachVisitTypes.prePqa.includes)) {
      setTitle('Pre-PQA site visits summary');
      return prePqaSteps;
    }
    if (activityName === coachVisitTypes.supportVisit) {
      setTitle(coachVisitTypes.supportVisit);
      return supportVisitSteps;
    }

    if (activityName.includes(coachVisitTypes.pqa.followUp.name)) {
      setTitle(coachVisitTypes.pqa.followUp.description);
      return supportVisitSteps;
    }

    if (isPQA && isViewDetails) {
      return getFirstPqaSteps({
        isToShowStep1: false,
        isStep11AnswerTrue: !!pqaStep11Answer,
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
      });
    }

    if (isReAccreditation) {
      setTitle('Reaccreditation summary');
      return reAccreditationSteps;
    }

    setTitle('Self-assessment');
    return selfAssessmentSteps;
  }, [activityName, isViewDetails, pqaStep11Answer]);

  const isHideSteps = isView && currentSteps.length === 1;

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

  const onSubmitSelfAssessment = (payload: SupportVisitModelInput) => {
    appDispatch(
      pqaActions.addVisitFormData(payload, {
        userId: user?.id!,
        formType: 'self-assessment',
      })
    );

    appDispatch(pqaThunkActions.addSelfAssessmentForPractitioner(payload));
  };

  const handleOnSubmit = () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const data: CmsVisitDataInputModelInput = {
      practitionerId: user?.id,
      visitData: {
        sections,
      },
    };

    const payload: SupportVisitModelInput = {
      practitionerId: user?.id,
      plannedVisitDate: new Date(),
      attended: true,
      supportData: data,
    };

    if (activityName.includes(visitTypes.selfAssessment.includes)) {
      onSubmitSelfAssessment(payload);
    }
  };

  const renderSubmitButtonStyle =
    useMemo((): DynamicFormProps['submitButton'] => {
      if (isView) {
        if (isViewPqaOrReAccreditation) {
          return { icon: 'EyeIcon', text: 'View details', type: 'filled' };
        }

        return { icon: 'XIcon', text: 'Close', type: 'outlined' };
      }

      return undefined;
    }, [isView, isViewPqaOrReAccreditation]);

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
        isLoading={isLoadingSelfAssessment}
        isView={isView}
        {...(isViewPqaOrReAccreditation && { onView })}
      />
    </BannerWrapper>
  );
};
