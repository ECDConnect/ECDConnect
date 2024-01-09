import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import WalktroughImage from '../../../../../../assets/walktroughImage.png';
import { useAppContext } from '@/walkthrougContext';

export default function StatementsWrapper() {
  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();
  const disableNextButton =
    stepIndex === 0 || stepIndex === 2 || stepIndex === 4 || stepIndex === 6;

  const steps: StepType[] = [
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
      spotlightPadding: 16,
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
      content: "Let's pretend a parent gave you school fees today, tap here!",
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#preeschoolFee1',
      content: 'You will need to fill in all the info on this screen',
      placement: 'bottom-end',
      offset: 20,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#savePreschoolFee',
      content: "I've filled in an example for you! Now tap Save",
      placement: 'top',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#statementsDashboard',
      content:
        'Great! Your income has now been added to the summary income statement on the money tab',
      placement: 'bottom-end',
      offset: 60,
      disableBeacon: true,
    },
    {
      target: '#howMayDaysToSubmit',
      content:
        "I'll tell you how many days you have left to submit the next statement",
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#submitIncomeButton',
      content:
        "When you're ready, you can tap here to submit the final statement to SmartStart",
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#lastStep',
      content: "Great job, you're ready to start!",
      placement: 'bottom-end',
      offset: 10,
    },
  ];

  // useSetState(() => {
  //   setState({
  //     steps: [
  //       {
  //         target: '#startStatements',
  //         content: 'Tap here to get started!',
  //         placement: 'auto',
  //         disableBeacon: true,
  //         spotlightClicks: true,
  //       },
  //       {
  //         target: '#createStatements',
  //         content:
  //           'You can choose whether you want to add income or expenses to your income statement',
  //         placement: 'bottom',
  //         offset: 10,
  //         disableBeacon: true,
  //         spotlightPadding: 16,
  //       },
  //       {
  //         target: '#createIncome',
  //         content: "Let's go through one example! Tap income",
  //         placement: 'bottom-end',
  //         offset: 10,
  //         spotlightClicks: true,
  //       },
  //       {
  //         target: '#incomeList',
  //         content:
  //           'See a list of income types. For income that is not on this list, you can choose “Other”',
  //         placement: 'bottom-end',
  //         offset: 10,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#actionList0',
  //         content:
  //           "Let's pretend a parent gave you school fees today, tap here!",
  //         placement: 'bottom-end',
  //         offset: 10,
  //         spotlightClicks: true,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#preeschoolFee1',
  //         content: 'You will need to fill in all the info on this screen',
  //         placement: 'bottom-end',
  //         offset: 20,
  //         spotlightClicks: true,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#savePreschoolFee',
  //         content: "I've filled in an example for you! Now tap Save",
  //         placement: 'top',
  //         offset: 10,
  //         spotlightClicks: true,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#statementsDashboard',
  //         content:
  //           'Great! Your income has now been added to the summary income statement on the money tab',
  //         placement: 'bottom-end',
  //         offset: 60,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#howMayDaysToSubmit',
  //         content:
  //           "I'll tell you how many days you have left to submit the next statement",
  //         placement: 'bottom-end',
  //         offset: 10,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#submitIncomeButton',
  //         content:
  //           "When you're ready, you can tap here to submit the final statement to SmartStart",
  //         placement: 'bottom-end',
  //         offset: 10,
  //         spotlightClicks: true,
  //         disableBeacon: true,
  //       },
  //       {
  //         target: '#lastStep',
  //         content: "Great job, you're ready to start!",
  //         placement: 'bottom-end',
  //         offset: 10,
  //       },
  //     ],
  //   });
  // });

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
              totalItems={10}
              activeIndex={index}
              className={'p-4'}
            />
            {!disableNextButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="primary"
                  className={'w-6/12'}
                  onClick={() => {}}
                >
                  <Typography
                    type="help"
                    className="mr-2"
                    color="white"
                    text={isLastStep ? 'Close' : 'Next'}
                  />
                </Button>
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
      setState({ run: true, stepIndex: 2, enableButton: false });
    } else if (type === 'step:after' && index === 2) {
      setState({ run: true, stepIndex: 3 });
    } else if (type === 'step:after' && index === 3) {
      setState({ run: true, stepIndex: 4 });
    } else if (type === 'step:after' && index === 5) {
      setState({ run: true, stepIndex: 6 });
    } else if (type === 'step:after' && index === 7) {
      setState({ run: true, stepIndex: 8 });
    } else if (type === 'step:after' && index === 8) {
      setState({ run: true, stepIndex: 9 });
    } else if (type === 'step:after' && index === 9) {
      setState({ run: true, stepIndex: 10 });
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
        styles={{
          spotlight: {
            borderWidth: 4,
            borderRadius: 20,
            borderColor: '#99231b',
            borderStyle: 'solid',
          },
        }}
      />
    </div>
  );
}
