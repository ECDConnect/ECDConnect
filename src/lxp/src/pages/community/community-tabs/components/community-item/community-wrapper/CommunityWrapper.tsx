import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import robot from '../../../../../../assets/iconRobot.svg';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/walkthrougContext';

export default function CommunityWrapper() {
  const { t } = useTranslation();
  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();
  const screenHeight = window.innerHeight;

  const steps: StepType[] = [
    {
      target: '#firstTimeECDHeroes',
      content: t('Ok, you can tap this button when you are ready to join!'),
      placement: 'auto',
      offset: screenHeight < 650 ? 0 : 10,
      disableBeacon: true,
    },
  ];

  function Tooltip({
    index,
    isLastStep,
    primaryProps,
    step,
    tooltipProps,
  }: TooltipRenderProps) {
    return (
      <div {...tooltipProps} className="ml-2">
        <Card className="rounded-2xl p-6">
          <div>
            {step.content && (
              <div className="flex items-center gap-2 align-middle">
                <img
                  src={robot}
                  className="mr-4 h-20 w-20"
                  alt="walkthrough profile"
                />
                <Typography
                  color={'textDark'}
                  type={'h2'}
                  weight={'normal'}
                  text={String(step?.content)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 pl-20">
            <SliderPagination totalItems={0} activeIndex={index} />
            <div {...primaryProps} className={'flex w-full justify-end'}>
              <Button
                type="filled"
                color="quatenary"
                textColor="white"
                icon={stepIndex === 3 ? 'XIcon' : 'ArrowCircleRightIcon'}
                text={isLastStep ? 'Close' : 'Next'}
                onClick={() => {}}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const handleCallback = async (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;

    if (type === 'step:after' && index === 0) {
      setState({ run: true, stepIndex: 1, enableButton: false });
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        setState({ run: true, stepIndex: 2, enableButton: false });
      } else {
        setState({ run: true, stepIndex: 0 });
      }
    }
  };

  return (
    <div>
      <Joyride
        callback={handleCallback}
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        tooltipComponent={Tooltip}
        scrollToFirstStep
        showProgress
        showSkipButton
        disableOverlayClose
        styles={{
          spotlight: {
            borderWidth: 4,
            borderRadius: 20,
            borderColor: '#FF2180',
            borderStyle: 'solid',
          },
        }}
      />
    </div>
  );
}
