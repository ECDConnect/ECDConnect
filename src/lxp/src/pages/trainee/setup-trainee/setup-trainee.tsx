import {
  BannerWrapper,
  Button,
  Card,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { useTheme } from '@ecdlink/core';
import WelcomeImage from '../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import {
  practitionerActions,
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { PractitionerInput } from '@ecdlink/graphql';

const MOCKED_INCOMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2020',
  },
  steps: [
    {
      title: 'Starter Licence',
      subTitle: '22 Feb 2020',
      type: 'todo',
    },
  ] as StepItem[],
};

const MOCKED_COMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2020',
  },
  steps: [
    {
      title: 'Attended day 1 of start-up training',
      subTitle: '22 Feb 2020',
      type: 'completed',
    },
  ] as StepItem[],
};

export const SetupTrainee = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const updatePractitionerSetupInitiated = () => {
    const copy = Object.assign({}, practitioner);
    copy.setupTraineeInitiated = true;

    const input: PractitionerInput = {
      SetupTraineeInitiated: true,
      IsActive: true,
      Progress: copy.progress,
      Id: copy.id,
    };

    appDispatch(practitionerActions.updatePractitioner(copy));
    appDispatch(practitionerThunkActions.updatePractitioner(input));
  };

  return (
    <>
      <BannerWrapper
        onBack={() => history?.push(ROUTES.DASHBOARD)}
        color="primary"
        className={'h-full'}
        title={`Welcome`}
        subTitle="Your onboarding journey"
        displayOffline={!isOnline}
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
      >
        <div className="p-4">
          <div className="my-4 flex items-center justify-center">
            <Card className="bg-uiBg flex w-full flex-col justify-center rounded-xl p-4">
              <div className="flex w-full justify-center">
                <img
                  src={WelcomeImage}
                  alt="welcome"
                  className="my-4 h-36 w-36"
                />
              </div>
              <div className="flex flex-wrap justify-center">
                <Typography
                  type="h3"
                  text={'Start your onboarding journey!'}
                  color={'textDark'}
                  className={'semibold'}
                />
              </div>
              <div className="flex flex-wrap justify-center">
                <Typography
                  type="h4"
                  text={
                    'Complete each step by the deadline. Some steps can only be completed once previous steps are done.'
                  }
                  color={'textMid'}
                />
              </div>
            </Card>
          </div>
          <div
            className="py-4 pt-4" style={{ borderBottom: '2px dashed #5c3ca0' }}
          >
            <Steps
              items={MOCKED_INCOMPLETE_DATA.steps}
              typeColor={{ completed: 'successMain' }}
            />
            <Typography
              className="-mt-4"
              color={'textMid'}
              type={'body'}
              text={`When you a finish a step, a green circle and a tick will appear next to the step.`}
            />
          </div>

          <div className="py-4 pt-4">
            <Steps
              items={MOCKED_COMPLETE_DATA.steps}
              typeColor={{ completed: 'successMain' }}
            />
            <Typography
              className="-mt-4"
              color={'textMid'}
              type={'body'}
              text={`When you a finish a step, a green circle and a tick will appear next to the step.`}
            />
          </div>
          <div className="mt-4 -mb-4 h-full w-full self-end">
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="primary"
              text="Start"
              textColor="white"
              icon="ArrowCircleRightIcon"
              onClick={() => {
                updatePractitionerSetupInitiated();
                history?.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING);
              }}
            />
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
