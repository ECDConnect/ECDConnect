import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../../../../walkthrougContext';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import IconRobot from '@/assets/svg-components/iconRobot';
import ROUTES from '../../../../../routes/routes';
import { useAppDispatch } from '@/store';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { useTranslation } from 'react-i18next';

export default function AttendanceWrapper() {
  const { t } = useTranslation();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const {
    setState,
    state: { run, stepIndex, attendanceStatus, enableButton },
  } = useAppContext();

  const steps: StepType[] = [
    {
      target: '#attendance-list',
      content: t('All children are automatically marked present'),
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#attendance-list-alone',
      content: t('Tap anywhere on this block to mark Jane absent today'),
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !!attendanceStatus,
      event: 'click',
    },
    {
      target: '#attendance-list-alone',
      content: t('Now tap again to mark Jane present.'),
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !!attendanceStatus,
    },
    {
      target: '#attendance-list-alone',
      content: t("Great, you're ready to start!"),
      placement: 'bottom-end',
      offset: 10,
    },
  ];

  function Tooltip({
    backProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
  }: TooltipRenderProps) {
    return (
      <div {...tooltipProps} className="ml-2">
        <Card className="rounded-2xl p-6">
          <div>
            {step.content && (
              <div className="flex items-center gap-2 align-middle">
                <IconRobot className="mr-4 h-20 w-20" />
                <Typography
                  color={'textDark'}
                  type={'h2'}
                  weight={'normal'}
                  text={String(step?.content)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex justify-start">
              <SliderPagination
                totalItems={4}
                activeIndex={index}
                className="p-4"
              />
            </div>
            {enableButton && (
              <div {...primaryProps}>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
                  textColor="white"
                  icon={stepIndex === 3 ? 'XIcon' : 'ArrowCircleRightIcon'}
                  text={isLastStep ? 'Close' : 'Next'}
                  onClick={() => {}}
                />
              </div>
            )}
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
    } else if (type === 'step:before' && index === 2) {
      setState({ attendanceStatus: false });
    } else if (type === 'step:after' && index === 2) {
      setState({ run: true, stepIndex: 3 });
    } else if (
      type === 'step:after' &&
      index === 3 &&
      (action === 'reset' || lifecycle === 'complete')
    ) {
      setState({ run: false, stepIndex: 0, tourActive: false });
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: TabsItems.ATTENDANCE,
      });
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
          options: {
            arrowColor: stepIndex === 3 ? 'transparent' : 'white',
          },
          spotlight:
            stepIndex === 3
              ? {
                  background: 'transparent',
                }
              : {
                  borderWidth: 4,
                  borderRadius: 20,
                  borderColor: '#ED145B',
                  borderStyle: 'solid',
                },
        }}
      />
    </div>
  );
}
