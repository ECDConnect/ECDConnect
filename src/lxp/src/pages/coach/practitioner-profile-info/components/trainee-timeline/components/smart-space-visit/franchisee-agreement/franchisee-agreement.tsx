import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import {
  traineeActions,
  traineeSelectors,
  traineeThunkActions,
} from '@/store/trainee';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './franchisee-agreement.types';
import { useAppDispatch } from '@/store';
import { CoachTraineeFranchisorAgreement1 } from './components/franchisee-agreement-step1';
import { userSelectors } from '@/store/user';
import {
  SmartSpaceVisit,
  SmartSpaceVisitData,
} from '@/store/trainee/trainee.types';
import { newGuid } from '@/utils/common/uuid.utils';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
  setNotificationStep: any;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner: PractitionerDto;
}

export const FranchiseeAgreement: React.FC<CoachSmartSpaceChecklistProps> = ({
  setNotificationStep,
  practitioner: trainee,
}) => {
  const history = useHistory();
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitioner = location.state.practitioner || trainee;
  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner.userId || '')
  );
  const coachSmartSpaceVisitId = timeline?.sSCoachVisitId;

  const [sectionQuestions, setSectionQuestions] = useState<
    SmartSpaceVisitData[]
  >([]);
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.FRANCHISEE_AGREEMENT
  );

  const saveFranchisorAgreementData = (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => {
    const otherSectionData = sectionQuestions.filter(
      (item) => item.visitSection !== visitSection
    );

    const newVisitData = [...otherSectionData, ...value];
    setSectionQuestions(newVisitData);

    const visit: SmartSpaceVisit = {
      traineeId: practitioner.userId!,
      visitId: coachSmartSpaceVisitId,
      coachId: user?.id!,
      visitData: newVisitData,
    };

    appDispatch(traineeActions.saveFranchiseeAgreementData(visit));
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      setNotificationStep('');
      history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
        practitionerId: practitioner?.userId || practitioner?.user?.id,
      });
    }
    setActiveStep(activeStep - 1);
  };

  const submitCoachFranchisorAgreement = async () => {
    await appDispatch(
      traineeActions.setFranchiseeAgreementVisitSyncId({
        visitId: coachSmartSpaceVisitId,
        syncId: newGuid(),
      })
    );
    appDispatch(
      traineeThunkActions.submitTraineeFranchisorAgreementData(
        coachSmartSpaceVisitId
      )
    );

    setNotificationStep && setNotificationStep('');
  };

  const renderStep = (step: number) => {
    switch (step) {
      default:
        return (
          <CoachTraineeFranchisorAgreement1
            smartSpaceVisitId={coachSmartSpaceVisitId}
            saveFranchisorAgreementData={saveFranchisorAgreementData}
            practitioner={practitioner}
            submitCoachFranchisorAgreement={submitCoachFranchisorAgreement}
          />
        );
    }
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => handleBackButton()}
      color="primary"
      className={'h-full'}
      title={`Franchisee agreement`}
      subTitle={`${practitioner?.user?.fullName}`}
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
