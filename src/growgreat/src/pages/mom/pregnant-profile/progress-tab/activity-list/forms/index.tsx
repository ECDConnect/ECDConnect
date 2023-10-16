import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDialog, usePrevious } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfantById } from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { MotherProfileParams, currentActivityKey } from '..';
import { activitiesTypes } from '../activities-list';
import { DynamicForm } from './dynamic-form';
import {
  careForBabySteps,
  getHealhcareteps,
  followUpSteps,
  getPregnancyCareSteps,
  dangerSignsSteps,
} from './steps';
import {
  getPreviousVisitInformationForMotherSelector,
  getVisitAnswersForMotherSelector,
} from '@/store/visit/visit.selectors';
import { dangerSignsVisitSectionForBaby } from './nutrition-steps/danger-signs';
import { getReferralsForMotherSelector } from '@/store/mother/mother.selectors';
import {
  getIsMotherFirstVisitSelector,
  getMotherById,
} from '@/store/mother/mother.selectors';
import { dangerSignsVisitSection } from '@/pages/infant/infant-profile/progress-tab/activity-list/forms/care-for-mom-steps/danger-signs';
import { getPregnancyDay } from '@/utils/mom/pregnant.utils';
import {
  idDocumentFirstQuestion,
  idDocumentSecondQuestion,
} from './pregnancy-care-steps/nutrition/complementary-feeding-flow/id-document';
import { dangerSignsSectionName } from './danger-signs-steps/danger-signs';
import { maternalDistressVisitSection } from './pregnancy-care-steps/maternal-distress/result';
import { muacQuestion } from './nutrition-steps/mother-growth-muac';
import { HIVQuestion } from './pregnancy-care-steps/nutrition/complementary-feeding-flow/hiv-care';
import { visitThunkActions } from '@/store/visit';
import { useAppDispatch } from '@/store';
import { antenatalClinicQuestion } from './healthcare-steps/clinic-visits';

interface FormProps {
  onBack: () => void;
}

const sessionStorageKey = 'currentStepNumber';

export const Form = ({ onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const previousVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );
  const referralsForMother = useSelector(getReferralsForMotherSelector);

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const { id: motherId, visitId } = useParams<MotherProfileParams>();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const isFirstVisit = useSelector(getIsMotherFirstVisitSelector);
  const previousAnswers = useSelector(getVisitAnswersForMotherSelector);

  const IDDocumentFirstPreviousAnswer = previousVisit?.visitDataStatus?.find(
    (item) => item?.visitData?.question === idDocumentFirstQuestion
  );
  const IDDocumentSecondPreviousAnswer = previousVisit?.visitDataStatus?.find(
    (item) => item?.visitData?.question === idDocumentSecondQuestion
  );

  const antenatalVisitQuestionAnswer = previousAnswers?.find(
    (item) => item?.question === antenatalClinicQuestion
  )?.questionAnswer;

  const previousMUAC = useMemo(
    () =>
      previousAnswers?.find((item) => item?.question === muacQuestion)
        ?.questionAnswer,
    [previousAnswers]
  );

  const previousHIV = useMemo(
    () =>
      previousAnswers?.find((item) => item?.question === HIVQuestion)
        ?.questionAnswer,
    [previousAnswers]
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

  const pregnancyDay = getPregnancyDay(mother?.expectedDateOfDelivery!);

  const isEqualOrAfter98andEqualOrBefore168Days =
    pregnancyDay >= 98 && pregnancyDay <= 168;

  const isEqualOrAfter196Days = pregnancyDay >= 196;

  const isIDDocumentStep =
    isFirstVisit ||
    (Boolean(IDDocumentFirstPreviousAnswer?.visitData?.questionAnswer) ===
      false &&
      Boolean(IDDocumentSecondPreviousAnswer?.visitData?.questionAnswer) ===
        true);

  const isAntenatalClinicStep =
    isFirstVisit || !antenatalVisitQuestionAnswer?.includes('true');

  const isAlcoholUseStep =
    isFirstVisit && isEqualOrAfter98andEqualOrBefore168Days;

  const isMaternalDistress =
    isFirstVisit &&
    (pregnancyDay < 98 ||
      (pregnancyDay >= 169 && pregnancyDay <= 196) ||
      pregnancyDay > 197);

  const isMaternalDistressFollowUp = isFollowUp(
    maternalDistressVisitSection,
    activitiesTypes.pregnancyCare
  );

  const isDangerSignsFollowUpForMom = isFollowUp(
    dangerSignsVisitSection,
    activitiesTypes.healthCare
  );
  const isDangerSignsFollowUpForBaby = isFollowUp(
    dangerSignsVisitSectionForBaby,
    activitiesTypes.nutrition
  );

  const isDangerSignsFollowUpStep = isFollowUp(
    dangerSignsSectionName,
    activitiesTypes.dangerSigns
  );

  const IsHIVCareStep =
    isFirstVisit || previousHIV! === 'true' || previousHIV! === 'unsure';
  const isMUACStep = isFirstVisit || Number(previousMUAC!) < 22;

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';
  const activityNamePrevious = usePrevious(activityName);

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
      case activitiesTypes.healthCare:
        return getHealhcareteps({
          isDangerSignsFollowUp: isDangerSignsFollowUpForMom,
          isFirstVisit,
          isAntenatalClinicStep,
        });
      case activitiesTypes.nutrition:
        return careForBabySteps(isDangerSignsFollowUpForBaby, isMUACStep);
      case activitiesTypes.pregnancyCare:
        return getPregnancyCareSteps(
          isEqualOrAfter98andEqualOrBefore168Days,
          isAlcoholUseStep,
          isIDDocumentStep,
          isMaternalDistressFollowUp,
          isMaternalDistress,
          IsHIVCareStep,
          isEqualOrAfter196Days
        );
      case activitiesTypes.dangerSigns:
        return dangerSignsSteps(isDangerSignsFollowUpStep, isFirstVisit);
      default:
        return followUpSteps(!!referralsForMother?.length);
    }
  }, [
    activityName,
    isDangerSignsFollowUpForMom,
    isFirstVisit,
    isAntenatalClinicStep,
    isDangerSignsFollowUpForBaby,
    isMUACStep,
    isEqualOrAfter98andEqualOrBefore168Days,
    isAlcoholUseStep,
    isIDDocumentStep,
    isMaternalDistressFollowUp,
    isMaternalDistress,
    IsHIVCareStep,
    isEqualOrAfter196Days,
    isDangerSignsFollowUpStep,
    referralsForMother?.length,
  ]);

  useEffect(() => {
    if (!activityNamePrevious && activityName === activitiesTypes.followUp) {
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForMother({
          visitId,
        })
      ).unwrap();
      appDispatch(
        visitThunkActions.GetMotherSummaryByPriority({
          visitId,
        })
      );
    }
  }, [activityName, activityNamePrevious, appDispatch, visitId]);

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
        mother={mother}
        isTipPage={isTip}
        currentStep={step}
        setIsTip={setIsTip}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
      />
    </BannerWrapper>
  );
};
