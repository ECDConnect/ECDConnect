import { useCallback, useMemo, useState } from 'react';
import { getAgeInYearsMonthsAndDays, useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfantById } from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { currentActivityKey } from '..';
import { activitiesTypes } from '../activities-list';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import {
  careForBabySteps,
  getCareForMomSteps,
  followUpSteps,
  getPillar1Steps,
  getPillar4Steps,
  pillar2Steps,
  pillar3Steps,
  pillar5Steps,
} from './steps';
import { nutritionQuestion } from './pillar-1-steps/nutrition';
import {
  breastfeedingIssuesCheckboxQuestion,
  breastfeedingIssuesCheckboxOptions,
} from './pillar-1-steps/nutrition/breast-milk-only-flow/breastfeeding-issues';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { dangerSignsVisitSection } from './care-for-mom-steps/danger-signs';
import { dangerSignsVisitSectionForBaby } from './care-for-baby-steps/danger-signs';
import { DevelopmentalScreeningVisitSection } from './pillar-2-steps/developmental-screening-weeks';
import { getReferralsForInfantSelector } from '@/store/referral/referral.selectors';

interface FormProps {
  onBack: () => void;
}

const sessionStorageKey = 'currentStepNumber';

export const Form = ({ onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
  const referralsForInfant = useSelector(getReferralsForInfantSelector);

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);

  const isChild6Months = useMemo(
    () => !ageYears && ageMonths < 7,
    [ageMonths, ageYears]
  );

  const isFollowUp = useCallback(
    (section: string, visitName: string) => {
      return !!previousVisit?.visitDataStatus?.some(
        (item) =>
          item?.section === section &&
          item.visitData?.visitName === visitName &&
          item.color !== 'Success'
      );
    },
    [previousVisit?.visitDataStatus]
  );

  const isDangerSignsFollowUpForMom = isFollowUp(
    dangerSignsVisitSection,
    activitiesTypes.careForMom
  );
  const isDangerSignsFollowUpForBaby = isFollowUp(
    dangerSignsVisitSectionForBaby,
    activitiesTypes.careForBaby
  );

  const isDevelopmentalScreeningWeeksFollowUp = isFollowUp(
    DevelopmentalScreeningVisitSection,
    activitiesTypes.pillar2
  );

  const nutritionAnswer = sectionQuestions
    ?.flatMap((section) => section.questions)
    .find((item) => item.question === nutritionQuestion)?.answer;

  const breastfeedingIssuesAnswers = sectionQuestions
    ?.flatMap((section) => section.questions)
    .find((item) => item.question === breastfeedingIssuesCheckboxQuestion)
    ?.answer as string[];

  const isToSkipBreastfeedingIssuesRelevantItemsStep =
    breastfeedingIssuesAnswers?.includes(
      breastfeedingIssuesCheckboxOptions.noneOption
    );

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  // TODO: add integration (G5.6.2)
  const isPillar4FollowUp = true;

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

  const currentSteps = useMemo(() => {
    switch (activityName) {
      case activitiesTypes.careForMom:
        return getCareForMomSteps(isDangerSignsFollowUpForMom);
      case activitiesTypes.careForBaby:
        return careForBabySteps(isDangerSignsFollowUpForBaby);
      case activitiesTypes.pillar1:
        return getPillar1Steps(
          nutritionAnswer,
          isToSkipBreastfeedingIssuesRelevantItemsStep,
          isChild6Months
        );
      case activitiesTypes.pillar2:
        return pillar2Steps(isDevelopmentalScreeningWeeksFollowUp);
      case activitiesTypes.pillar3:
        return pillar3Steps;
      case activitiesTypes.pillar4:
        return getPillar4Steps(isPillar4FollowUp);
      case activitiesTypes.pillar5:
        return pillar5Steps;
      default:
        return followUpSteps(!!referralsForInfant?.length);
    }
  }, [
    activityName,
    isDangerSignsFollowUpForMom,
    isDangerSignsFollowUpForBaby,
    nutritionAnswer,
    isToSkipBreastfeedingIssuesRelevantItemsStep,
    isChild6Months,
    isDevelopmentalScreeningWeeksFollowUp,
    isPillar4FollowUp,
    referralsForInfant?.length,
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
        name={activityName}
        steps={currentSteps}
        infant={infant}
        isTipPage={isTip}
        currentStep={step}
        setIsTip={setIsTip}
        setSectionQuestions={setSectionQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
      />
    </BannerWrapper>
  );
};
