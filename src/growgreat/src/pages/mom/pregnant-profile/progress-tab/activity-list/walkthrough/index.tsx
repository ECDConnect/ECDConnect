import { InfantDto } from '@ecdlink/core';
import JoyRide, { Step as StepType, TooltipRenderProps } from 'react-joyride';
import { useMemo, useRef, useState } from 'react';
import { Screen1 } from './screen1';
import { Screen2 } from './screen2';
import { Screen3 } from './screen3';
import {
  BannerWrapper,
  Button,
  Card,
  SliderPagination,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';

export interface Step {
  infantName?: string;
  caregiverName?: string;
  currentStep?: number;
  className?: string;
  showComponent?: boolean;
  onClick?: () => void;
}

function Tooltip({
  backProps,
  continuous,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  size,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div {...tooltipProps} className={!isLastStep ? 'ml-5' : 'mr-1'}>
      <Card className="mt-auto rounded-2xl p-6">
        {step.content && (
          <div className="flex items-center gap-4 align-middle">
            {[0, 1, 3, 5, 7].includes(index) && (
              <div className="bg-tertiary h-20 w-20 rounded-full">
                <Polly className="h-20 w-20" />
              </div>
            )}
            {[2, 4, 6].includes(index) && (
              <div>
                <PollyNeutral className="h-20 w-20" />
              </div>
            )}
            {index === 8 && (
              <div>
                <PollyImpressed className="h-20 w-20" />
              </div>
            )}
            {index === 9 && (
              <div>
                <PollyTime className="h-20 w-20" />
              </div>
            )}
            <Typography
              color={'textDark'}
              type={'h2'}
              weight={'normal'}
              text={String(step?.content)}
            />
          </div>
        )}
        <div className="mt-4 flex justify-between gap-4">
          {index <= size - 2 && (
            <SliderPagination
              totalItems={size - 1}
              activeIndex={index}
              className={'py-4'}
            />
          )}
          {!step.spotlightClicks && (
            <div {...primaryProps} className={'flex w-full justify-end'}>
              <Button
                type="filled"
                color="primary"
                textColor="white"
                className="w-full"
                icon={index < size - 2 ? 'ArrowCircleRightIcon' : 'XIcon'}
                text={index < size - 2 ? 'Next' : 'Close'}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
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
        tooltipComponent={Tooltip}
        styles={{
          spotlight: {
            borderWidth: stepIndex === 8 ? 0 : 4,
            borderRadius: 20,
            borderColor: '#FF6C00',
            borderStyle: 'solid',
            background: stepIndex === 8 ? 'transparent' : 'gray',
          },
          options: {
            arrowColor: stepIndex === 8 ? 'transparent' : 'white',
          },
        }}
      />
      <div id="step9" className="h-0 w-full" />
    </div>
  );
};
