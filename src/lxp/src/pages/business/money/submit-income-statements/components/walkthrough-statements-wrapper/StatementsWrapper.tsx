import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import IconRobotBlue from '@/assets/svg-components/iconRobotBlue';
import { useAppContext } from '@/walkthrougContext';
import { useTranslation } from 'react-i18next';
import {
  practitionerActions,
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function StatementsWrapper() {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { t } = useTranslation();
  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();
  const disableNextButton =
    stepIndex === 0 || stepIndex === 2 || stepIndex === 4 || stepIndex === 6;

  const steps: StepType[] = [
    {
      target: '#startStatements',
      content: t('Tap here to get started!'),
      placement: 'auto',
      disableBeacon: true,
      spotlightClicks: true,
    },
    {
      target: '#createStatements',
      content: t(
        'You can choose whether you want to add income or expenses to your income statement'
      ),
      placement: 'bottom',
      offset: 10,
      disableBeacon: true,
      spotlightPadding: 16,
    },
    {
      target: '#createIncome',
      content: t("Let's go through one example! Tap income"),
      placement: 'bottom-end',
      spotlightClicks: true,
    },
    {
      target: '#incomeList',
      content: t(
        'See a list of income types. For income that is not on this list, you can choose “Other”'
      ),
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#actionList1',
      content: t('Lets pretend you received a donation today, tap "add"!'),
      placement: 'top',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#donationsOrVouchers',
      content: t('You will need to fill in all the info on this screen'),
      placement: 'bottom-end',
      // offset: 20,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#saveDonationsOrVouchers',
      content: t("I've filled in an example for you! Now tap Save"),
      placement: 'top',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#statementsDashboard',
      content: t(
        'Great! Your income has now been added to the summary income statement on the money tab'
      ),
      placement: 'bottom-end',
      offset: 60,
      disableBeacon: true,
    },
    {
      target: '#seeAllStatements',
      content: t(
        'You can see, change, or download you statements by tapping this button'
      ),
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#lastStep',
      content: t("Great job, you're ready to start!"),
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
      <div {...tooltipProps} className="ml-2 max-w-xs">
        <Card className="rounded-2xl p-6">
          <div>
            {step.content && (
              <div className="flex items-center gap-2 align-middle">
                <IconRobotBlue
                  className="shrink-0"
                  style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
                />
                <div className="min-w-0">
                  <Typography
                    color={'textDark'}
                    type={'h2'}
                    weight={'normal'}
                    text={String(step?.content)}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex justify-start">
              <SliderPagination
                totalItems={10}
                activeIndex={index}
                className="p-4"
              />
            </div>

            {!disableNextButton && (
              <div {...primaryProps}>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
                  onClick={() => {}}
                  text={isLastStep ? 'Close' : 'Next'}
                  textColor="white"
                  icon={isLastStep ? 'XIcon' : 'ArrowCircleRightIcon'}
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
      setState({ run: true, stepIndex: 2, enableButton: false });
    } else if (type === 'step:after' && index === 2) {
      setState({ run: true, stepIndex: 3 });
    } else if (type === 'step:after' && index === 3) {
      setState({ run: true, stepIndex: 4 });
    } else if (type === 'step:after' && index === 5) {
      setState({ run: true, stepIndex: 6 });
    } else if (type === 'step:after' && index === 6) {
      setState({ run: true, stepIndex: 7 });
    } else if (type === 'step:after' && index === 7) {
      setState({ run: true, stepIndex: 8 });
    } else if (type === 'step:after' && index === 8) {
      setState({ run: true, stepIndex: 9 });
    } else if (action === 'reset' || lifecycle === 'complete') {
      setState({ run: false, stepIndex: 0, tourActive: false });
      if (!practitioner?.isCompletedBusinessWalkThrough) {
        appDispatch(
          practitionerActions.updateBusinessWalkthroughComplete(true)
        );
        if (isOnline) {
          await appDispatch(
            practitionerThunkActions.updatePractitionerBusinessWalkThrough()
          );
        }
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
          options: {
            arrowColor: stepIndex === 9 ? 'transparent' : 'white',
          },
          spotlight:
            stepIndex === 9
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
