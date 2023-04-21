import { InfantDto } from '@ecdlink/core';
import JoyRide, { Step as StepType } from 'react-joyride';
import { useMemo, useRef, useState } from 'react';
import { Screen1 } from './screen1';
import { Screen2 } from './screen2';
import { Screen3 } from './screen3';
import { BannerWrapper } from '@ecdlink/ui';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import { Tooltip } from '@/components/walkthrough/tooltip';

export interface Step {
  infantName?: string;
  caregiverName?: string;
  currentStep?: number;
  className?: string;
  showComponent?: boolean;
  onClick?: () => void;
}

export const Walkthrough = ({
  infant,
  onClose,
}: {
  infant?: InfantDto;
  onClose: () => void;
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const infantName = useMemo(() => infant?.user?.firstName, [infant]);
  const caregiverName = useMemo(() => infant?.caregiver?.firstName, [infant]);

  const joyrideRef = useRef(null);

  const steps: StepType[] = [
    {
      content: "First I'll show you a summary of your client's progress.",
      target: '#step1',
      placement: 'bottom',
      disableBeacon: true,
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'Then, I will show you everything you need to do at this visit.',
      target: '#step2',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'When you’re ready to start the visit, tap the first section.',
      target: '#step3',
      placement: 'bottom',
      spotlightClicks: true,
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'I’ll guide you through the visit and give you discussion tips',
      target: '#step4',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'For more information or tips, you can tap this button',
      target: '#step5',
      placement: 'bottom',
      spotlightClicks: true,
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'Great! Tap here to see all the sections you have completed',
      target: '#step6',
      placement: 'bottom',
      spotlightClicks: true,
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'Here’s the list of activities you’ve finished',
      target: '#step7',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content:
        'When you have finished all the activities, you can do your “follow up”.',
      target: '#step8',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content: 'Great job, you’re ready to start!”.',
      target: '#step9',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
    {
      content:
        'Ok, you can always get  help by tapping the question mark at the top of the screen!',
      target: '#step10',
      placement: 'bottom',
      disableOverlayClose: true,
      disableCloseOnEsc: true,
    },
  ];

  const onNextStep = () => {
    if (stepIndex === 9) {
      onClose();
    }

    setStepIndex((prevState) => prevState + 1);
  };

  return (
    <div className="h-full overflow-auto ">
      <div>
        <BannerWrapper
          size="medium"
          renderBorder
          onBack={() => {}}
          title={infantName}
          subTitle="Child visit activities"
          backgroundColour="white"
          displayHelp
          onHelp={() => {}}
          helpId="step10"
          className="block"
        />
      </div>
      <Screen1
        className={stepIndex > 0 ? 'hidden' : 'block'}
        infantName={infantName}
        caregiverName={caregiverName}
      />
      <Screen2 currentStep={stepIndex} onClick={onNextStep} />
      <Screen3
        className={stepIndex > 4 ? 'hidden' : 'block'}
        caregiverName={caregiverName}
        showComponent={[3, 4].includes(stepIndex)}
        onClick={onNextStep}
      />
      <JoyRide
        //run
        ref={joyrideRef}
        continuous
        hideCloseButton
        showProgress
        stepIndex={stepIndex}
        callback={(e) =>
          e.lifecycle === 'complete' && !e.step.spotlightClicks && onNextStep()
        }
        steps={steps}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            pollyInformationalSteps={[0, 1, 3, 5, 7]}
            pollyNeutralSteps={[2, 4, 6]}
            pollyImpressedSteps={[8]}
            pollyTimeSteps={[9]}
            displayCloseButton={props.index < props.size - 2}
          />
        )}
        styles={getJoyrideStyles(stepIndex === 8)}
      />
      <div id="step9" className="h-0 w-full" />
    </div>
  );
};
