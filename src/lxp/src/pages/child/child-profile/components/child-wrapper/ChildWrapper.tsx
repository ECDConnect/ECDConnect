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

export default function ChildWrapper() {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();

  useSetState(() => {
    setState({
      steps: [
        // {
        //   target: '#child_progress_observations',
        //   content: 'See all of your upcoming tasks for the child at the top',
        //   placement: 'bottom',
        //   disableBeacon: true,
        //   spotlightClicks: true,
        // },
        {
          target: '#child_walkthrough_step_0',
          content: 'See the child’s attendance  ',
          placement: 'bottom',
          offset: 10,
          disableBeacon: true,
          spotlightPadding: 16,
        },
        {
          target: '#child_walkthrough_step_1',
          content: 'See the child’s progress reports',
          placement: 'bottom',
          offset: 10,
          disableBeacon: true,
          spotlightPadding: 16,
        },
        {
          target: '#child_walkthrough_step_2',
          content:
            'See child & caregiver information',
          placement: 'bottom-end',
          offset: 10,
          spotlightClicks: true,
        },
        {
          target: '#child_walkthrough_step_4',
          content:
            'Add notes about the child',
          placement: 'bottom-end',
          offset: 10,
          spotlightClicks: true,
        },
        {
          target: '#child_remove',
          content:
            'When the child graduates or leaves, remove them from your programme',
          placement: 'bottom-end',
          offset: 10,
          disableBeacon: true,
        },
        {
          target: '#lastStep',
          content: 'Great job, you’re ready to start!',
          placement: 'bottom-end',
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
              totalItems={5}
              activeIndex={index}
              className={'p-4'}
            />

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
    } else if (type === 'step:after' && index === 4) {
      setState({ run: true, stepIndex: 5 });
    } else if (action === 'reset' || lifecycle === 'complete') {
      setStorageItem(true, LocalStorageKeys.childProfileTutorialComplete);

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
            borderWidth: '4px',
            borderRadius: 20,
            borderColor: stepIndex === 5 ? ' ' : '#ED145B',
            borderStyle: 'solid',
          },
        }}
      />
    </div>
  );
}
