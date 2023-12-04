import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../../../../walkthrougContext';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import WalktroughImage from '../../../../../assets/walktroughImage.png';
import ROUTES from '../../../../../routes/routes';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store';

export default function AttendanceWrapper() {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const {
    setState,
    state: { run, stepIndex, attendanceStatus, enableButton },
  } = useAppContext();

  const steps: StepType[] = [
    {
      target: '#attendance-list',
      content: 'All children are automatically marked present',
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#attendance-list-alone',
      content: 'Tap anywhere on this block to mark Jane absent today',
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !!attendanceStatus,
      event: 'click',
    },
    {
      target: '#attendance-list-alone',
      content: 'Now tap again to mark Jane present.',
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !!attendanceStatus,
    },
    {
      target: '#attendance-list-alone',
      content: "Great, you're ready to start!",
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
                <img src={WalktroughImage} alt="walkthrough profile" />
                <Typography
                  color={'textDark'}
                  type={'h2'}
                  weight={'normal'}
                  text={String(step?.content)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-end gap-4">
            <SliderPagination
              totalItems={4}
              activeIndex={index}
              className={'p-4'}
            />
            {enableButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="primary"
                  className={'w-6/12'}
                  onClick={() => {}}
                >
                  {/* {renderIcon('XIcon', `w-5 h-5 text-white mr-2`)} */}
                  <Typography
                    type="help"
                    className="mr-2"
                    color="white"
                    text={isLastStep ? 'Close' : 'Next'}
                  />
                </Button>
              </div>
            )}
            {/* )} */}
          </div>
        </Card>
      </div>
    );
  }

  const updatePractitionerProgress = async () => {
    await appDispatch(
      practitionerThunkActions.updatePractitionerProgress({
        practitionerId: practitioner?.userId,
        progress: 3.0,
      })
    );
  };

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
      if (practitioner?.progress! < 3) {
        await updatePractitionerProgress();
      }
      history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 0 });
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
      />
    </div>
  );
}
