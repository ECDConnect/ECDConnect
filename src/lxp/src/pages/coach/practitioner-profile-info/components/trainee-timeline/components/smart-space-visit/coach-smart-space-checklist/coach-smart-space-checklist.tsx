import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { Route } from 'workbox-routing';
import { SmartSpaceCheck2 } from './components/smart-space-check-2';
import { useSelector } from 'react-redux';
import { traineeActions, traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './coach-smart-space-checklist.types';
import { SmartSpaceCheck1 } from './components/smart-space-check-1';
import { SmartSpaceCheck3 } from './components/smart-space-check-3';
import { useAppDispatch } from '@/store';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner: PractitionerDto;
}

export const CoachSmartSpaceChecklist: React.FC<
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

  console.log({ sectionQuestions });

  const handleNextSection = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
      return;
    }

    setActiveStep(CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK);
  };

  const saveSmartSpaceCheckData = () => {
    appDispatch(traineeActions.saveCoachSmartSpaceCheckData(sectionQuestions));
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      return;
    }
    setActiveStep(activeStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <SmartSpaceCheck2
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 3:
        return (
          <SmartSpaceCheck3
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
          />
        );
      case 4:
        return null;
      case 5:
        return null;
      case 6:
        return null;
      case 7:
        return null;
      default:
        return (
          <SmartSpaceCheck1
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
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
