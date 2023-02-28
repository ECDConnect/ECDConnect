import Joyride, { CallBackProps, TooltipRenderProps } from 'react-joyride';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  renderIcon,
  SliderPagination,
  Typography,
} from '@ecdlink/ui';
import { useSetState } from 'react-use';
import WalktroughImage from '../../../../../../assets/walktroughImage.png';
import { useAppContext } from '@/walkthrougContext';
import ROUTES from '@/routes/routes';

export default function StatementsWrapper() {
  const history = useHistory();
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();
  const disableNextButton =
    stepIndex === 0 || stepIndex === 2 || stepIndex === 4;

  console.log({ disableNextButton });

  useSetState(() => {
    setState({
      steps: [
        {
          target: '#startStatements',
          content: 'Tap here to get started!',
          placement: 'auto',
          disableBeacon: true,
          spotlightClicks: true,
        },
        {
          target: '#createStatements',
          content:
            'You can choose whether you want to add income or expenses to your income statement',
          placement: 'bottom',
          offset: 10,
          disableBeacon: true,
        },
        {
          target: '#createIncome',
          content: "Let's go through one example! Tap income",
          placement: 'bottom-end',
          offset: 10,
          spotlightClicks: true,
        },
        {
          target: '#incomeList',
          content:
            'See a list of income types. For income that is not on this list, you can choose “Other”',
          placement: 'bottom-end',
          offset: 10,
          disableBeacon: true,
        },
        {
          target: '#actionList0',
          content:
            "Let's pretend a parent gave you school fees today, tap here!",
          placement: 'bottom-end',
          offset: 10,
          spotlightClicks: true,
          disableBeacon: true,
        },
        {
          target: '#preeschoolFee1',
          content: "Let's go through one example! Tap income",
          placement: 'bottom-end',
          offset: 80,
          spotlightClicks: true,
          disableBeacon: true,
        },
      ],
    });
  });

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
            {!disableNextButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="primary"
                  className={'w-6/12'}
                  icon={'SaveIcon'}
                  onClick={() => {}}
                >
                  {renderIcon('XIcon', `w-5 h-5 text-white mr-2`)}
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

  const handleCallback = async (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;

    if (type === 'step:after' && index === 0) {
      console.log('step reset 1');
      setState({ run: true, stepIndex: 1, enableButton: false });
    } else if (type === 'step:after' && index === 1) {
      console.log('step reset 2');
      setState({ run: true, stepIndex: 2, enableButton: false });
    } else if (type === 'step:after' && index === 2) {
      console.log('step reset 4');
      setState({ run: true, stepIndex: 3 });
    } else if (type === 'step:after' && index === 3) {
      console.log('step reset 5');
      setState({ run: true, stepIndex: 4 });
    } else if (action === 'reset' || lifecycle === 'complete') {
      setState({ run: false, stepIndex: 0, tourActive: false });
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
