import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { traineeActions, traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './trainee-franchisor-agreement.types';
import { useAppDispatch } from '@/store';
import { CoachTraineeFranchisorAgreement1 } from './components/coach-franchisor-agreement';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner: PractitionerDto;
}

export const CoachTraineeFranchisorAgreement: React.FC<
  CoachSmartSpaceChecklistProps
> = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitioner = location.state.practitioner;
  const programmeName = useSelector(
    traineeSelectors.getTraineeVisitDataProgrammeName
  );
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK
  );

  const handleNextSection = () => {
    if (activeStep < 11) {
      setActiveStep(activeStep + 1);
      return;
    }

    setActiveStep(CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK);
  };

  const saveFranchisorAgreementData = () => {
    appDispatch(
      traineeActions.saveCoachFranchisorAgreementData(sectionQuestions)
    );
  };

  const visitData = useSelector(
    traineeSelectors.getCoachFranchisorAgreementData
  );

  console.log({ visitData });

  const handleBackButton = () => {
    if (activeStep === 1) {
      history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
        practitionerId: practitioner?.userId,
      });
    }
    setActiveStep(activeStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return null;
      default:
        return (
          <CoachTraineeFranchisorAgreement1
            saveSmartSpaceCheckData={saveFranchisorAgreementData}
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
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
      title={`SmartSpace visith`}
      subTitle={`${activeStep} of 10`}
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
