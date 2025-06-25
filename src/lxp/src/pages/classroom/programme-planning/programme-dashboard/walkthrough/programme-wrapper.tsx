import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import {
  Button,
  Card,
  renderIcon,
  SliderPagination,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Robot } from '../../../../../assets/iconRobot.svg';
import { useAppContext } from '@/walkthrougContext';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { useTranslation } from 'react-i18next';
import { usePrevious } from 'react-use';
import { useEffect } from 'react';

export default function ProgrammeWrapper() {
  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();

  const history = useHistory();

  const { t, i18n } = useTranslation();

  const previousLanguage = usePrevious(i18n.language);
  const previousStepIndex = usePrevious(stepIndex);

  useEffect(() => {
    if (stepIndex === 0) {
      window.sessionStorage.setItem('i18nLanguage', i18n.language);
    }

    if (
      window.sessionStorage.getItem('i18nLanguage') !== i18n.language &&
      stepIndex !== 0
    ) {
      i18n.changeLanguage(window.sessionStorage.getItem('i18nLanguage')!);
    }
  }, [i18n, previousLanguage, previousStepIndex, stepIndex]);

  const disableNextButton =
    stepIndex === 0 ||
    stepIndex === 1 ||
    stepIndex === 4 ||
    stepIndex === 6 ||
    stepIndex === 7;

  const steps: StepType[] = [
    // 0
    {
      target: '#walkthrough-start',
      content: t('Tap here to add at a theme!'),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 1
    {
      target: '#walkthrough-nature-theme',
      content: t("I'll show you an example - tap the Nature theme"),
      offset: 10,
      placement: 'auto',
      disableBeacon: true,
      disableOverlay: false,
    },
    // 2
    {
      target: '#walkthrough-theme-timing',
      content: t('You can choose a start date and end date for this theme.'),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 3
    {
      target: '#walkthrough-classroom-language',
      content: t(
        "You can choose a language for this theme. I'll show you activities in this language if available."
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 4
    {
      target: '#walkthrough-plan-activity',
      content: t(
        'Great! I have planned all your activities! Tap an activity to see the detail.'
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 5
    {
      target: '#walkthrough-activity-detail',
      content: t(
        "See the activity details here. You're all done with adding a theme!"
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 6
    {
      target: '#walkthrough-add-activity',
      content: t(
        "If you don't want to use a theme, you can tap here to choose an activity!"
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 7
    {
      target: '#walkthrough-small-group-activity',
      content: t('Tap the box to choose the activity'),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // 8
    {
      target: '#walkthrough-small-group-activity-learn',
      content: t(
        'Great! Now the activity is selected. When you want to learn more about an activity, you can tap the blue “i” icon.'
      ),
      placement: 'auto',
      offset: 10,
      disableBeacon: true,
      disableOverlay: false,
    },
    // new end
    // 9
    {
      target: '#walkthrough-last-step',
      content: t("Great, you're ready to start!"),
      placement: 'bottom',
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
                <Robot />
                <Typography
                  color={'textDark'}
                  type={'h2'}
                  weight={'normal'}
                  text={String(step?.content)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <SliderPagination
              totalItems={9}
              activeIndex={index}
              className={'p-4'}
            />
            {!disableNextButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="quatenary"
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
    const { index, type } = data;

    if (type === 'step:after' && index === 0) {
      setState({ run: true, stepIndex: 1, enableButton: false });
    } else if (type === 'step:after' && index === 1) {
      setState({ run: true, stepIndex: 2, enableButton: false });
    } else if (type === 'step:after' && index === 2) {
      setState({ run: true, stepIndex: 3 });
    } else if (type === 'step:after' && index === 3) {
      setState({ run: true, stepIndex: 4 });
      // redirect back to activities page'
      history.push(ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT);
    } else if (type === 'step:after' && index === 4) {
      setState({ run: true, stepIndex: 5 });
    } else if (type === 'step:after' && index === 5) {
      setState({ run: true, stepIndex: 6 });
      const activityDetailsComponent = document.getElementById(
        'headlessui-portal-root'
      );
      if (activityDetailsComponent) {
        activityDetailsComponent.remove();
      }
    } else if (type === 'step:after' && index === 6) {
      setState({ run: true, stepIndex: 7 });
    } else if (type === 'step:after' && index === 7) {
      setState({ run: true, stepIndex: 8 });
    } else if (type === 'step:after' && index === 8) {
      setState({ run: true, stepIndex: 9 });
    } else if (type === 'step:after' && index === 9) {
      setState({ run: false, stepIndex: 0, tourActive: false });
      window.sessionStorage.removeItem('i18nLanguage');
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
              ? {}
              : {
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
