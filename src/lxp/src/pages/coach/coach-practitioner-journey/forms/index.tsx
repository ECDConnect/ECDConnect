import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseBool, useDialog, usePrevious, useSnackbar } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import {
  PractitionerJourneyParams,
  visitTypes,
} from '../coach-practitioner-journey.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  delicensingSteps,
  generalSupportVisit,
  getFirstPqaSteps,
  prePqaVisits,
} from './steps';
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SupportVisitModelInput,
} from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PqaActions } from '@/store/pqa/pqa.actions';
import { ReactComponent as IconRobot } from '@/assets/iconRobot.svg';
import { useAppDispatch } from '@/store';
import { callAnswer, visitOrCallQuestion } from './general-support-visit';
import {
  step11VisitSection,
  step16Question1,
  step16VisitSection,
  step19Question2Pqa,
} from './pqa-visits/first-pqa';
import {
  PractitionerActions,
  deActivatePractitioner,
} from '@/store/practitioner/practitioner.actions';
import {
  delicensingQuestion2,
  delicensingStep1VisitSection,
} from './delicensing';
import { ChildrenDialog } from './dialog';

interface SubmitProps {
  sections: InputMaybe<InputMaybe<CmsVisitSectionInput>[]>;
  payload: CmsVisitDataInputModelInput;
}

interface FormProps {
  visitId?: string;
  onBack: () => void;
}

export const currentActivityKey = 'selectedOption';
export const visitIdKey = 'visitId';
export const isViewKey = 'isView';
const sessionStorageKey = 'currentStepNumber';

export const Form = ({ visitId, onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [currentActivity, setCurrentActivity] = useState('');
  const [title, setTitle] = useState('');

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const firstName = practitioner?.user?.firstName || 'the SmartStarter';
  const step16Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step16VisitSection)
    ?.questions.find((item) => item.question === step16Question1)?.answer;
  const isToRemoveSmartStarter = step16Question1Answer === true;

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingSupportVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_SUPPORT_VISIT_FORM_DATA
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
      isStep11AnswerTrue,
      isToRemoveSmartStarter,
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
    ({ payload, sections }: SubmitProps) => {
      const visitOrCallSection = sections?.find((item) =>
        item?.questions?.some(
          (question) => question?.question === visitOrCallQuestion
        )
      )?.questions;
      const visitOrCallAnswer = visitOrCallSection?.find(
        (item) => item?.question === visitOrCallQuestion
      )?.answer;

      const supportVisitPayload: SupportVisitModelInput = {
        practitionerId,
        plannedVisitDate: new Date(),
        isSupportCall: visitOrCallAnswer === callAnswer,
        // TODO: add schedule option
        attended: true,
        supportData: payload,
      };
      appDispatch(
        pqaActions.addVisitFormData(supportVisitPayload, {
          userId: practitionerId,
          formType: 'support-visit',
        })
      );
      appDispatch(pqaThunkActions.addSupportVisitFormData(supportVisitPayload));
      onBack?.();
      showMessage({
        message: `${
          visitOrCallAnswer === callAnswer ? 'Support call' : 'Support visit'
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
      showMessage,
      practitionerId,
    ]
  );

  const onSubmitPrePqa = useCallback(
    ({ payload }: SubmitProps) => {
      appDispatch(
        pqaActions.addVisitFormData(payload, {
          userId: practitionerId,
          formType: 'pre-pqa',
        })
      );
      appDispatch(pqaThunkActions.addVisitFormData(payload));
      displayChildrenDialog('First site visit');
    },
    [appDispatch, displayChildrenDialog, practitionerId]
  );

  const onSubmitPqa = useCallback(
    ({ payload, sections }: SubmitProps) => {
      const step19Question2 = sections?.find((item) =>
        item?.questions?.some(
          (question) => question?.question === step19Question2Pqa
        )
      )?.questions;
      const step19Question2Answer = step19Question2?.find(
        (item) => item?.question === step19Question2Pqa
      )?.answer;

      if (step19Question2Answer === 'true') {
        displayChildrenDialog('First PQA visit');
      }
    },
    [displayChildrenDialog]
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

    switch (activityName) {
      case visitTypes.supportVisit:
        onSubmitSupportVisit({ payload, sections });
        break;
      case visitTypes.pqa.firstPQA.name:
        onSubmitPqa({ payload, sections });
        break;
      default:
        onSubmitPrePqa({ payload, sections });
        break;
    }
  }, [
    activityName,
    onSubmitPqa,
    onSubmitPrePqa,
    onSubmitSupportVisit,
    practitionerId,
    sectionQuestions,
    visitId,
  ]);

  const onSubmitDelicensing = () => {
    const leavingComment = sectionQuestions
      ?.find((item) => item.visitSection === delicensingStep1VisitSection)
      ?.questions?.find((item) => item.question === delicensingQuestion2)
      ?.answer as string | undefined;

    if (!!practitioner?.userId) {
      appDispatch(
        deActivatePractitioner({ userId: practitioner?.userId, leavingComment })
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
    switch (visitName) {
      case visitTypes.pqa.firstPQA.name:
        setTitle(visitTypes.pqa.firstPQA.description);
        return getFirstPqaSteps({ isStep11AnswerTrue, isToRemoveSmartStarter });
      case visitTypes.supportVisit:
        return generalSupportVisit;
      case visitTypes.delicensing:
        return delicensingSteps;
      default:
        if (activityName === visitTypes.prePqa.first.name) {
          setTitle(visitTypes.prePqa.first.description);
        } else {
          setTitle(visitTypes.prePqa.second.description);
        }

        return prePqaVisits;
    }
  }, [activityName, isStep11AnswerTrue, isToRemoveSmartStarter, visitName]);

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
        isLoading={isLoading || isLoadingSupportVisit || isLoadingDeactivate}
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
      />
    </BannerWrapper>
  );
};
