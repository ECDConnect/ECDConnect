import { BannerWrapper } from '@ecdlink/ui';
import { Step1 } from './components/step-1';
import { useState } from 'react';

export enum ChildProgressAssessmentSteps {
  AddCoachingCircleStepOne = 1,
  AddCoachingCircleStepTwo = 2,
}

interface AddCoachingCircleProps {
  setShowAddCircles: (item: boolean) => void;
}

export const AddCoachingCircle: React.FC<AddCoachingCircleProps> = ({
  setShowAddCircles,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const AddCoachingCircleSteps = (step: ChildProgressAssessmentSteps) => {
    switch (step) {
      case ChildProgressAssessmentSteps?.AddCoachingCircleStepTwo:
        return <Step1 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Add a coaching circle'}
        subTitle={`step  of 6`}
        onBack={() => setShowAddCircles(false)}
        renderOverflow
        backgroundColour={'white'}
        //   displayOffline={!isOnline}
      >
        {AddCoachingCircleSteps(activeStep)}
      </BannerWrapper>
    </>
  );
};
