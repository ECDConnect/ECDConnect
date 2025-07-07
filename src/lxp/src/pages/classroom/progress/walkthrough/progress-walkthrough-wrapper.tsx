import Joyride, {
  CallBackProps,
  TooltipRenderProps,
  Step as StepType,
} from 'react-joyride';
import { Button, Card, SliderPagination, Typography } from '@ecdlink/ui';
import WalktroughImage from '../../../../assets/walktroughImage.png';
import { useAppContext } from '@/walkthrougContext';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import progressWalkthroughAf from '../../../../i18n/modules/progress/walkthrough/af.json';
import progressWalkthroughEn from '../../../../i18n/modules/progress/walkthrough/en-za.json';
import progressWalkthroughNr from '../../../../i18n/modules/progress/walkthrough/nr.json';
import progressWalkthroughXh from '../../../../i18n/modules/progress/walkthrough/xh.json';
import progressWalkthroughZu from '../../../../i18n/modules/progress/walkthrough/zu.json';
import progressWalkthroughNso from '../../../../i18n/modules/progress/walkthrough/nso.json';
import progressWalkthroughSt from '../../../../i18n/modules/progress/walkthrough/st.json';
import progressWalkthroughTn from '../../../../i18n/modules/progress/walkthrough/tn.json';
import progressWalkthroughSS from '../../../../i18n/modules/progress/walkthrough/ss.json';
import progressWalkthroughVe from '../../../../i18n/modules/progress/walkthrough/ve.json';
import progressWalkthroughTso from '../../../../i18n/modules/progress/walkthrough/tso.json';

export default function ProgressWalkthroughWrapper() {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const appDispatch = useAppDispatch();
  const history = useHistory();

  const {
    setState,
    state: { run, stepIndex, childId, language },
  } = useAppContext();

  const disableNextButton =
    stepIndex === 1 ||
    stepIndex === 3 ||
    stepIndex === 4 ||
    stepIndex === 5 ||
    stepIndex === 6 ||
    stepIndex === 7;

  const translations: { [lang: string]: { [key: string]: string } } = {
    af: progressWalkthroughAf,
    'en-za': progressWalkthroughEn,
    nr: progressWalkthroughNr,
    xh: progressWalkthroughXh,
    zu: progressWalkthroughZu,
    nso: progressWalkthroughNso,
    st: progressWalkthroughSt,
    tn: progressWalkthroughTn,
    ss: progressWalkthroughSS,
    ve: progressWalkthroughVe,
    tso: progressWalkthroughTso,
  };

  const steps: StepType[] = [
    {
      target: '#progressWalkthroughStep1',
      content:
        translations[language][
          'Throughout the year, observe children & add your observations'
        ],
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
      spotlightPadding: 16,
    },
    {
      target: '#startObservationsButton',
      content:
        translations[language][
          "Let's pretend you're tracking progress for a child named Temba.\n\nTap here to get started!"
        ],
      placement: 'bottom',
      offset: 10,
      disableBeacon: true,
      spotlightPadding: 16,
      spotlightClicks: true,
    },
    {
      target: '#ageGroupIndicator',
      content:
        translations[language][
          "You will be shown the right assessment for the child's age."
        ],
      placement: 'bottom-end',
      spotlightClicks: true,
    },
    {
      target: '#skill-0',
      content:
        translations[language][
          'Pretend that, while observing Temba, you see that he does smile.\n\nTap “Yes” to answer!'
        ],
      placement: 'bottom',
      offset: 10,
      disableBeacon: true,
      spotlightPadding: 16,
    },
    {
      target: '#skill-0',
      content:
        translations[language][
          "Great!\n\n If you are not sure if Temba can do something, you can choose “Dont't know”"
        ],
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#skill-pic-1',
      content:
        translations[language][
          'Some questions have pictures attached.\n\nTap here to see the picture.'
        ],
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#skill-pic-close',
      content:
        translations[language][
          'Tap close to hide the picture and go back to the progress tracker.'
        ],
      placement: 'bottom',
      offset: 20,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#saveAndExitButton',
      content:
        translations[language][
          'You can always leave the progress tracker and come back later to finish. All of your answers will be saved.\n\nTap here.'
        ],
      placement: 'top',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#reportButtons',
      content:
        translations[language][
          'When you have answered all the questions, you can create the report for the caregiver or you can view your answers again.'
        ],
      placement: 'bottom-end',
      offset: 60,
      disableBeacon: true,
    },
    {
      target: '#pastReports',
      content:
        translations[language][
          'You can see all of your completed reports back on the main reports page.'
        ],
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: true,
      disableBeacon: true,
    },
    {
      target: '#progressEnd',
      content: translations[language]["Great job, you're ready to start!"],
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
              totalItems={10}
              activeIndex={index}
              className={'p-4'}
            />
            {!disableNextButton && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
                  className={''}
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
    const { index, lifecycle, type } = data;

    if (type === 'step:after' && index === 0) {
      setState({ run: true, stepIndex: 1 });
    } else if (type === 'step:after' && index === 2) {
      setState({ run: true, stepIndex: 3 });
    } else if (type === 'step:after' && index === 5) {
      setState({ run: true, stepIndex: 6 });
    } else if (type === 'step:after' && index === 8) {
      setState({ run: true, stepIndex: 9 });
    } else if (type === 'step:after' && index === 9) {
      setState({ run: true, stepIndex: 10 });
    } else if (lifecycle === 'complete' && index === 10) {
      setState({ run: false, stepIndex: 0, tourActive: false });
      appDispatch(
        practitionerThunkActions.updatePractitionerProgressWalkthrough({
          userId: practitioner?.userId!,
        })
      );
      history.replace(ROUTES.CHILD_PROFILE, {
        childId: childId,
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
        scrollOffset={100}
        tooltipComponent={Tooltip}
        scrollToFirstStep
        showProgress
        showSkipButton
        disableOverlayClose
        styles={{
          options: {
            arrowColor: stepIndex === 10 ? 'transparent' : 'white',
          },
          spotlight:
            stepIndex === 10
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
