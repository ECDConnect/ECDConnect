import { useCallback, useMemo, useState } from 'react';
import { useDialog } from '@ecdlink/core';
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
  getHealhcareteps,
  followUpSteps,
  getPillar1Steps,
  dangerSignsSteps,
} from './steps';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { dangerSignsVisitSectionForBaby } from './nutrition-steps/danger-signs';
import { DevelopmentalScreeningVisitSection } from './danger-signs-steps/developmental-screening-weeks';
import { getReferralsForInfantSelector } from '@/store/referral/referral.selectors';
import { getMotherById } from '@/store/mother/mother.selectors';
import { dangerSignsVisitSection } from '@/pages/infant/infant-profile/progress-tab/activity-list/forms/care-for-mom-steps/danger-signs';

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
  const [, , , motherId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  // TODO: add G3 visits tab integration
  const isFirstVisit = true;

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
    activitiesTypes.healthCare
  );
  const isDangerSignsFollowUpForBaby = isFollowUp(
    dangerSignsVisitSectionForBaby,
    activitiesTypes.nutrition
  );

  const isDevelopmentalScreeningWeeksFollowUp = isFollowUp(
    DevelopmentalScreeningVisitSection,
    activitiesTypes.pregnancyCare
  );

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

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
        return getHealhcareteps(isDangerSignsFollowUpForMom);
      case activitiesTypes.nutrition:
        return careForBabySteps(isDangerSignsFollowUpForBaby);
      case activitiesTypes.pregnancyCare:
        return getPillar1Steps();
      case activitiesTypes.dangerSigns:
        return dangerSignsSteps(isDevelopmentalScreeningWeeksFollowUp);
      default:
        return followUpSteps(!!referralsForInfant?.length);
    }
  }, [
    activityName,
    isDangerSignsFollowUpForMom,
    isDangerSignsFollowUpForBaby,
    isDevelopmentalScreeningWeeksFollowUp,
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
        mother={mother}
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
