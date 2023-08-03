import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { traineeActions } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './coach-self-assessment.types';
import { useAppDispatch } from '@/store';
import { CoachSelfAssessment1 } from './components/coach-self-assessment1';
import { CoachSelfAssessment2 } from './components/coach-self-assessment2';
import { CoachSelfAssessment3 } from './components/coach-self-assessment3/coach-self-assessment3';
import { CoachSelfAssessment4 } from './components/coach-self-assessment-4/coach-self-assessment4';
import { CoachSelfAssessment5 } from './components/coach-self-assessment-5/coach-self-assessment5';
import { CoachSelfAssessment6 } from './components/coach-self-assessment-6/coach-self-assessment6';
import { CoachSelfAssessment7 } from './components/coach-self-assessment-7/coach-self-assessment7';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner: PractitionerDto;
}

export const CoachSelfAssessment: React.FC<
  CoachSmartSpaceChecklistProps
> = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitioner = location.state.practitioner;
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

  const saveSmartSpaceCheckData = () => {
    appDispatch(traineeActions.saveCoachSmartSpaceCheckData(sectionQuestions));
  };

  const handleBackButton = () => {
    if (activeStep <= 0) {
      history.push(ROUTES.COACH_FRANCHISE_AGREEMENT, {
        practitionerId: practitioner?.userId,
      });
    }
    setActiveStep(activeStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <CoachSelfAssessment2
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 2:
        return (
          <CoachSelfAssessment3
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 3:
        return (
          <CoachSelfAssessment4
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 4:
        return (
          <CoachSelfAssessment5
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 5:
        return (
          <CoachSelfAssessment6
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 6:
        return (
          <CoachSelfAssessment7
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      default:
        return (
          <CoachSelfAssessment1
            // saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            // programmeName={programmeName}
            // setSectionQuestions={setSectionQuestions}
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
      title={
        activeStep === 0 ? `Discuss the self-assessment` : `Self-assessment`
      }
      subTitle={
        activeStep === 0
          ? `${practitioner?.user?.fullName}`
          : `${activeStep} of 6`
      }
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
