import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseBool, useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import {
  PractitionerJourneyParams,
  visitTypes,
} from '../coach-practitioner-journey.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { generalSupportVisit, prePqaVisits } from './steps';
import { pqaActions, pqaThunkActions } from '@/store/pqa';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SupportVisitModelInput,
} from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { usePrevious } from 'react-use';
import { PqaActions } from '@/store/pqa/pqa.actions';
import { ReactComponent as IconRobot } from '@/assets/iconRobot.svg';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { callAnswer, visitOrCallQuestion } from './general-support-visit';

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
  const [step, setStep] = useState(2);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();
  const appDispatch = useAppDispatch();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const isView = parseBool(window.sessionStorage.getItem(isViewKey) || '');

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const name = practitioner?.user?.firstName;

  const history = useHistory();

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_VISIT_FORM_DATA
  );
  const { isLoading: isLoadingSupportVisit } = useThunkFetchCall(
    'pqa',
    PqaActions.ADD_SUPPORT_VISIT_FORM_DATA
  );

  const wasLoading = usePrevious(isLoading);
  const wasLoadingSupportVisit = usePrevious(isLoadingSupportVisit);

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

  const onSuccess = useCallback(() => {
    dialog({
      position: DialogPosition.Bottom,
      color: 'bg-transparent',
      render: (onClose) => {
        return (
          <Alert
            className="mb-4"
            type="success"
            title={`${activityName} complete!`}
            button={
              <button onClick={onClose} className="absolute right-4 top-5">
                {renderIcon('XIcon', 'text-successDark h-6 w-6')}
              </button>
            }
          />
        );
      },
    });
  }, [activityName, dialog]);

  const handleOnBack = useCallback(() => {
    if (isTip) {
      return setIsTip(false);
    }

    if (step === 0) {
      return onBack();
    }

    return setStep((prevState) => prevState - 1);
  }, [isTip, onBack, step]);

  const handleOnNext = useCallback(() => {
    setStep((preState) => preState + 1);
  }, []);

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
        appDispatch(
          pqaThunkActions.addSupportVisitFormData(supportVisitPayload)
        );
        break;

      default:
        appDispatch(
          pqaActions.addVisitFormData(payload, {
            userId: practitionerId,
            formType: 'pre-pqa',
          })
        );
        appDispatch(pqaThunkActions.addVisitFormData(payload));
        break;
    }
  }, [activityName, appDispatch, practitionerId, sectionQuestions, visitId]);

  const displayChildrenDialog = useCallback(() => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            customIcon={<IconRobot className="mb-4" />}
            title={`Would you like to register any children for ${name}’s programme?`}
            detailText={`You can register children on your phone now. Or, help ${name} to register children on her phone.`}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Yes, register children now',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'CheckCircleIcon',
                onClick: () => {
                  onBack?.();
                  history.push(ROUTES.CHILD_REGISTRATION_LANDING, {
                    practitionerId,
                  });
                  onClose();
                },
              },
              {
                colour: 'primary',
                text: 'No, skip',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: () => {
                  setTimeout(() => onSuccess(), 100);
                  onBack?.();
                  onClose();
                },
              },
            ]}
          />
        );
      },
    });
  }, [dialog, history, name, onBack, onSuccess, practitionerId]);

  const currentSteps = useMemo(() => {
    switch (activityName) {
      case visitTypes.supportVisit:
        return generalSupportVisit;
      default:
        return prePqaVisits;
    }
  }, [activityName]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      displayChildrenDialog();
    }

    if (wasLoadingSupportVisit && !isLoadingSupportVisit) {
      onBack?.();
      onSuccess();
    }
  }, [
    displayChildrenDialog,
    isLoading,
    isLoadingSupportVisit,
    onBack,
    onSuccess,
    wasLoading,
    wasLoadingSupportVisit,
  ]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={handleOnBack}
      onClose={handleOnClose}
      title={activityName}
      subTitle={`${step + 1} of ${currentSteps.length}`}
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
        setIsTip={setIsTip}
        setSectionQuestions={setSectionQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
        onSubmit={onSubmit}
        isLoading={isLoading || isLoadingSupportVisit}
      />
    </BannerWrapper>
  );
};
