import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import robot from '../../../assets/iconRobot.svg';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/walkthrougContext';

export default function DashboardWrapper() {
  const { t } = useTranslation();
  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();

  const steps: StepType[] = [
    {
      target: '#wantToConnectWithPrincipal',
      content: t(
        'If you want to change these details later, tap your profile and go to “Preschool”.'
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#wantToConnectWithPrincipal2',
      content: t(
        'Great job! If you want to connect to your principal later or change your details, tap the profile button and go to “Preschool”.'
      ),
      placement: 'auto',
      offset: 10,
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
          <div className="gap- mt-4 flex items-center justify-between">
            <div {...primaryProps} className={'flex w-full justify-end'}>
              <Button
                type="filled"
                color="quatenary"
                textColor="white"
                icon={'XIcon'}
                text={'Close'}
                onClick={() => {}}
                className="w-full"
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
      // setState({ run: true, stepIndex: 1, enableButton: false });
      setState({ run: false, stepIndex: 0, tourActive: false });
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        setState({ run: false, stepIndex: 0, tourActive: false });
      } else {
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
