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
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { dangerSignsVisitSection } from './care-for-mom-steps/danger-signs';
import { dangerSignsVisitSectionForBaby } from './care-for-baby-steps/danger-signs';
import { DevelopmentalScreeningVisitSection } from './pillar-2-steps/developmental-screening-weeks';
import { getReferralsForInfantSelector } from '@/store/referral/referral.selectors';
import { differenceInDays } from 'date-fns';
import { InfantProfileParams } from '../../../infant-profile.types';
import { useParams } from 'react-router';
import { maternalDistressVisitSection } from './care-for-mom-steps/maternal-distress-screening';

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

  const { id: infantId, visitId } = useParams<InfantProfileParams>();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));

  const isChild6Months = useMemo(
    () => !ageYears && ageMonths < 7,
    [ageMonths, ageYears]
  );

  const isFirstVisit = useSelector((state: RootState) =>
    getIsInfantFirstVisitSelector(state, visitId)
  );

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
  const isMixedFeedingHowBreastfeedingWorks = useMemo(
    () => isFirstVisit && ageDays >= 7 && ageDays <= 13,
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

  const isSelfCareAndSupport = useMemo(
    () => isFirstVisit && ageDays >= 48 && ageDays <= 57,
    [ageDays, isFirstVisit]
  );

  const isChildBefore49Days = useMemo(() => ageDays <= 49, [ageDays]);

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

  const isMaternalDistressFollowUp = isFollowUp(
    maternalDistressVisitSection,
    activitiesTypes.careForMom
  );

  const isDevelopmentalScreening = useMemo(
    () => (ageDays >= 4 && ageDays <= 27) || (ageDays >= 49 && ageDays <= 56),
    [ageDays]
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

  const isPillar4FollowUp = isFollowUp(
    dangerSignsVisitSection,
    activitiesTypes.pillar4
  );

  const isShowClinicCheckUps = useMemo(
    () =>
      (isFirstVisit && ageDays >= 7 && ageDays <= 27) ||
      (isFirstVisit && ageDays >= 49 && ageDays <= 56),
    [ageDays, isFirstVisit]
  );

  const isNewBornCare = useMemo(
    () => !isFirstVisit && ageDays <= 28,
    [ageDays, isFirstVisit]
  );

  const isKangarooMotherCare = useMemo(
    () => isFirstVisit && ageDays <= 49,
    [ageDays, isFirstVisit]
  );

  const isDietFormStep = useMemo(
    () => !ageYears && ageMonths >= 6 && ageMonths <= 9,
    [ageMonths, ageYears]
  );

  const is6Week = ageDays >= 49 && ageDays <= 56;
  const is10Week = ageDays >= 57 && ageMonths <= 3;
  const is14Week = ageMonths === 4;
  const is6Month = ageMonths >= 6 && ageMonths < 9;
  const is9Month = ageMonths >= 9 && ageMonths < 12;
  const is12Month = ageMonths >= 12 && ageMonths < 15;
  const is18Month = ageMonths >= 18 && ageMonths < 21;
  const is2Years = ageMonths >= 24 && ageMonths < 30;
  const is2YearsAHalfYears = ageMonths >= 30 && ageMonths < 36;
  const is3Years = ageMonths >= 36 && ageMonths < 42;
  const is3YearsAHalfYears = ageMonths >= 42 && ageMonths < 48;
  const is4Years = ageMonths >= 48 && ageMonths < 54;
  const is4AHalfYears = ageMonths >= 54 && ageMonths < 60;
  const is5Years = ageMonths >= 60;

  const isImmunisationQuestion =
    isFirstVisit &&
    (is6Week ||
      is10Week ||
      is14Week ||
      is6Month ||
      is9Month ||
      is12Month ||
      is18Month);

  const isVitaminAQuestion =
    isFirstVisit &&
    (is6Month ||
      is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

  const isDewormingQuestion =
    isFirstVisit &&
    (is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

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
          isChildBefore49Days,
          isDangerSignsFollowUpForMom,
          isShowClinicCheckUps,
          isSelfCareAndSupport,
          isMaternalDistressFollowUp
        );
      case activitiesTypes.careForBaby:
        return careForBabySteps(
          isDangerSignsFollowUpForBaby,
          isChildBefore49Days,
          isNewBornCare,
          isKangarooMotherCare
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
          isMixedFeedingHowBreastfeedingWorks,
          isMixedFeedingUnsafeFeedingPractices,
          isShowInterventionStep: ageDays >= 7,
          isShowMuacStep: !isChild6Months,
          isDietFormStep,
        });
      case activitiesTypes.pillar2:
        return pillar2Steps(
          isDevelopmentalScreeningWeeksFollowUp,
          isDevelopmentalScreening
        );
      case activitiesTypes.pillar3:
        return pillar3Steps(
          isImmunisationQuestion,
          isVitaminAQuestion,
          isDewormingQuestion
        );
      case activitiesTypes.pillar4:
        return getPillar4Steps(isPillar4FollowUp, !isChildBefore49Days);
      case activitiesTypes.pillar5:
        return pillar5Steps;
      default:
        return followUpSteps(!!referralsForInfant?.length);
    }
  }, [
    activityName,
    isChildBefore49Days,
    isDangerSignsFollowUpForMom,
    isShowClinicCheckUps,
    isSelfCareAndSupport,
    isMaternalDistressFollowUp,
    isDangerSignsFollowUpForBaby,
    isNewBornCare,
    isKangarooMotherCare,
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
    isMixedFeedingHowBreastfeedingWorks,
    isMixedFeedingUnsafeFeedingPractices,
    ageDays,
    isDietFormStep,
    isDevelopmentalScreeningWeeksFollowUp,
    isDevelopmentalScreening,
    isImmunisationQuestion,
    isVitaminAQuestion,
    isDewormingQuestion,
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
