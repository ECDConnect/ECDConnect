import Joyride, { CallBackProps, TooltipRenderProps } from 'react-joyride';
import {
  Button,
  Card,
  renderIcon,
  SliderPagination,
  Typography,
} from '@ecdlink/ui';
import { useSetState } from 'react-use';
import WalktroughImage from '../../../../../assets/walktroughImage.png';
import { useAppContext } from '@/walkthrougContext';
import { LocalStorageKeys } from '@ecdlink/core';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import { useHistory } from 'react-router';

export default function ProgrammeWrapper() {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();

  const history = useHistory();
  const disableNextButton =
    stepIndex === 0 || stepIndex === 1 || stepIndex === 4;

  useSetState(() => {
    setState({
      steps: [
        {
          target: '#walkthrough-start',
          content: 'Tap here to add at a theme!',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
          // spotlightClicks: false,
          // disableOverlayClose: false,
          // disableCloseOnEsc: false,
        },
        {
          target: '#walkthrough-nature-theme',
          content: "I'll show you an example - tap the Nature theme",
          offset: 10,
          placement: 'auto',
          disableBeacon: true,
          disableOverlay: false,
        },
        {
          target: '#walkthrough-theme-timing',
          content: 'You can choose a start date and end date for this theme.',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: false,
        },
        {
          target: '#walkthrough-classroom-language',
          content:
            "You can choose a language for this theme. I'll show you activities in this language if available.",
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: false,
        },
        {
          target: '#walkthrough-plan-activity',
          content:
            'Great! I have planned your activities for Mondays through Thursdays! Tap on activity to see the detail.',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
        },
        {
          target: '#walkthrough-activity-detail',
          content: 'See the activity details here.',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
        },
        {
          target: '#walkthrough-friday-plan',
          content:
            'You will need to plan your own activities for Fridays.  Tap here to add a small group activity!',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
        },
        {
          target: '#walkthrough-activity',
          content: 'Tap the box to choose the activity.',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
        },
        {
          target: '#walkthrough-activity-selected',
          content:
            'Great! Now the activity is selected.  When you want to learn more about an activity, you can tap this icon.',
          placement: 'auto',
          offset: 10,
          disableBeacon: true,
          disableOverlay: true,
        },
        {
          target: '#lastStep',
          content: "Great, you're ready to start!",
          placement: 'auto',
          offset: 10,
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
              totalItems={10}
              activeIndex={index}
              className={'p-4'}
            />
            {!disableNextButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="primary"
                  className={'ml-10 w-6/12'}
                  onClick={() => {}}
                >
                  <Typography
                    type="body"
                    color="white"
                    text={isLastStep ? 'Close' : 'Next'}
                  />
                  {renderIcon('ArrowRightIcon', `w-5 h-5 text-white text-lg`)}
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
      // redirect back to programme tab on classroom dashboard
      history.replace('/classroom', { activeTabIndex: 3 });
    } else if (type === 'step:after' && index === 5) {
      setState({ run: true, stepIndex: 6 });
    } else if (type === 'step:after' && index === 7) {
      setState({ run: true, stepIndex: 8 });
    } else if (type === 'step:after' && index === 8) {
      setState({ run: true, stepIndex: 9 });
    } else if (type === 'step:after' && index === 9) {
      setState({ run: true, stepIndex: 10 });
    } else if (action === 'reset' || lifecycle === 'complete') {
      setStorageItem(true, LocalStorageKeys.programmeWalkthroughComplete);
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
