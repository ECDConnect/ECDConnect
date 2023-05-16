import { useCallback, useMemo, useState } from 'react';
import { useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import { PractitionerJourneyParams } from '../coach-practitioner-journey.types';
import { getPractitionerById } from '@/store/practitioner/practitioner.selectors';
import { prePqaVisits } from './steps';
import { useDispatch } from 'react-redux';
import { pqaActions } from '@/store/pqa';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
} from '@ecdlink/graphql';

interface FormProps {
  visitId: string;
  onBack: () => void;
}

export const currentActivityKey = 'selectedOption';
const sessionStorageKey = 'currentStepNumber';

export const Form = ({ visitId, onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();
  const appDispatch = useDispatch();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const practitioner = useSelector(getPractitionerById(practitionerId));

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

  const handleOnSubmit = () => {
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
    appDispatch(
      pqaActions.addVisitFormData(payload, {
        userId: practitionerId,
        formType: 'pre-pqa',
      })
    );
    console.log('Submitting', sectionQuestions);
  };

  const currentSteps = useMemo(() => {
    switch (activityName) {
      default:
        return prePqaVisits;
    }
  }, [activityName]);

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
        onSubmit={handleOnSubmit}
      />
    </BannerWrapper>
  );
};
