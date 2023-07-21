import { useCallback, useMemo, useState } from 'react';
import { getAgeInYearsMonthsAndDays, useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  getInfantById,
  getIsInfantFirstVisitSelector,
} from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
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
import { dangerSignsVisitSection } from './care-for-mom-steps/danger-signs';
import { getReferralsForInfantSelector } from '@/store/referral/referral.selectors';
import { differenceInDays } from 'date-fns';
import { InfantProfileParams } from '../../../infant-profile.types';
import { useParams } from 'react-router';
import { dangerSignsQuestion } from './pillar-4-steps/danger-signs';
import { riskOption2 } from './pillar-4-steps/danger-signs/options';
import { sicknessStepQuestion } from './pillar-4-steps/sickness';

interface FormProps {
  onBack: () => void;
  getIsFollowUp: (section: string, visitName: string) => boolean;
  stepsRules: {
    isDevelopmentalScreening: boolean;
    isDevelopmentalScreeningWeeksFollowUp: boolean;
    isDevelopmentalScreeningWeeks: boolean;
    isRoadToHealthBookStep: boolean;
    isDangerSignsFollowUpForBaby: boolean;
    isChildBefore49Days: boolean;
    isNewBornCare: boolean;
    isKangarooMotherCare: boolean;
    isDangerSignsFollowUpForMom: boolean;
    isShowClinicCheckUps: boolean;
    isSelfCareAndSupport: boolean;
    isMaternalDistress: boolean;
    isMaternalDistressFollowUp: boolean;
    isMaternalDistressScreening: boolean;
    isImmunisationQuestion: boolean;
    isVitaminAQuestion: boolean;
    isDewormingQuestion: boolean;
    isImmunisationsStep: boolean;
    isChildDocumentStep: boolean;
    isHivCareStep: boolean;
  };
}

const sessionStorageKey = 'currentStepNumber';

export const Form = ({ onBack, getIsFollowUp, stepsRules }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const referralsForInfant = useSelector(getReferralsForInfantSelector);

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const { id: infantId } = useParams<InfantProfileParams>();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const {
    years: ageYears,
    months: ageMonths,
    days,
  } = getAgeInYearsMonthsAndDays(dateOfBirth);
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));

  const dangerSignsAnswer = sectionQuestions
    ?.flatMap((section) => section.questions)
    .find((item) => item.question === dangerSignsQuestion)?.answer as string[];
  const isSicknessAlertStep = dangerSignsAnswer?.includes(riskOption2);

  const isChild6Months = useMemo(
    () => !ageYears && ((ageMonths === 6 && days === 0) || ageMonths < 6),
    [ageMonths, ageYears, days]
  );

  const isChildOlderthan6Months = useMemo(
    () => !ageYears && ageMonths >= 6,
    [ageMonths, ageYears]
  );

  const isFirstVisit = useSelector(getIsInfantFirstVisitSelector);

  const isFormulaMilkHowBreastfeedingWorks = useMemo(
    () => isFirstVisit && ageDays >= 7 && ageDays <= 13,
    [ageDays, isFirstVisit]
  );
  const isFormulaMilkUnsafeFeedingPractices = useMemo(
    () => isFirstVisit && ageDays >= 14 && ageDays <= 48,
    [ageDays, isFirstVisit]
  );

  const isMixedFeedingFoodsForm = isChild6Months;
  const isMixedFeedingBenefitsOfBreastfeeding = useMemo(
    () => isFirstVisit && ageDays < 7,
    [ageDays, isFirstVisit]
  );
  const isMixedFeedingUnsafeFeedingPractices = useMemo(
    () => isFirstVisit && ageDays >= 14 && ageDays <= 56,
    [ageDays, isFirstVisit]
  );
  const isMixedFeedingFistFoods = useMemo(
    () => isFirstVisit && !ageYears && ageMonths < 6,
    [ageMonths, ageYears, isFirstVisit]
  );

  const isMixedFeedingComplementaryFeedingAfter9Months = useMemo(
    () => (!ageYears && ageMonths >= 9) || (ageYears >= 1 && ageYears <= 5),
    [ageMonths, ageYears]
  );

  const isMixedFeedingComplementaryFeeding = useMemo(
    () => !ageYears && ageMonths >= 6 && ageMonths < 9,
    [ageMonths, ageYears]
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

  const sicknessStepAnswer = sectionQuestions
    ?.flatMap((section) => section.questions)
    .find((item) => item.question === sicknessStepQuestion)?.answer;

  const isToShowPillar4DangerSigns =
    sicknessStepAnswer === true && !stepsRules.isChildBefore49Days;

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const isPillar4FollowUp = getIsFollowUp(
    dangerSignsVisitSection,
    activitiesTypes.pillar4
  );

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
        return getCareForMomSteps(
          stepsRules.isChildBefore49Days,
          stepsRules.isDangerSignsFollowUpForMom,
          stepsRules.isShowClinicCheckUps,
          stepsRules.isSelfCareAndSupport,
          stepsRules.isMaternalDistress,
          stepsRules.isMaternalDistressFollowUp,
          stepsRules.isMaternalDistressScreening
        );
      case activitiesTypes.careForBaby:
        return careForBabySteps(
          stepsRules.isRoadToHealthBookStep,
          stepsRules.isDangerSignsFollowUpForBaby,
          stepsRules.isChildBefore49Days,
          stepsRules.isNewBornCare,
          stepsRules.isKangarooMotherCare
        );
      case activitiesTypes.pillar1:
        return getPillar1Steps({
          nutritionAnswer,
          isToSkipBreastfeedingIssuesRelevantItemsStep,
          isShowNutritionStep: isChild6Months,
          isFormulaMilkHowBreastfeedingWorks,
          isFormulaMilkUnsafeFeedingPractices,
          isMixedFeedingBenefitsOfBreastfeeding,
          isMixedFeedingComplementaryFeeding,
          isMixedFeedingComplementaryFeedingAfter9Months,
          isMixedFeedingFistFoods,
          isMixedFeedingFoodsForm,
          isMixedFeedingUnsafeFeedingPractices,
          isShowInterventionStep: ageDays >= 7,
          isShowMuacStep: isChildOlderthan6Months,
          isDietFormStep: isMixedFeedingComplementaryFeedingAfter9Months,
          isChildAfter7Days: ageDays >= 7,
        });
      case activitiesTypes.pillar2:
        return pillar2Steps(
          stepsRules.isDevelopmentalScreeningWeeksFollowUp,
          stepsRules.isDevelopmentalScreening,
          stepsRules.isDevelopmentalScreeningWeeks
        );
      case activitiesTypes.pillar3:
        return pillar3Steps(
          stepsRules.isImmunisationQuestion,
          stepsRules.isVitaminAQuestion,
          stepsRules.isDewormingQuestion,
          stepsRules.isImmunisationsStep
        );
      case activitiesTypes.pillar4:
        return getPillar4Steps(
          isPillar4FollowUp,
          !stepsRules.isChildBefore49Days,
          isSicknessAlertStep,
          isToShowPillar4DangerSigns
        );
      case activitiesTypes.pillar5:
        return pillar5Steps(
          stepsRules.isChildDocumentStep,
          stepsRules.isHivCareStep
        );
      default:
        return followUpSteps(!!referralsForInfant?.length);
    }
  }, [
    isToShowPillar4DangerSigns,
    isSicknessAlertStep,
    activityName,
    nutritionAnswer,
    isToSkipBreastfeedingIssuesRelevantItemsStep,
    isChild6Months,
    isFormulaMilkHowBreastfeedingWorks,
    isFormulaMilkUnsafeFeedingPractices,
    isMixedFeedingBenefitsOfBreastfeeding,
    isMixedFeedingComplementaryFeeding,
    isMixedFeedingComplementaryFeedingAfter9Months,
    isMixedFeedingFistFoods,
    isMixedFeedingFoodsForm,
    isMixedFeedingUnsafeFeedingPractices,
    ageDays,
    stepsRules,
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
