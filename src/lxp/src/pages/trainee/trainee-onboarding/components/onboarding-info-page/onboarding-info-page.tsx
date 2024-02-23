import {
  BannerWrapper,
  Button,
  Divider,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

const MOCKED_INCOMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2024',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: 'By 13 December 2023',
  },
  steps: [
    {
      title: 'Sign start-up support agreement',
      subTitle: '22 Feb 2024',
      type: 'todo',
      showActionButton: true,
      actionButtonText: 'Sign',
      actionButtonTextColor: 'primary',
      actionButtonIcon: 'PencilAltIcon',
      actionButtonClassName: 'border-primary',
      actionButtonColor: 'primary',
      actionButtonType: 'outlined',
      actionButtonIconStartPosition: true,
    },
  ] as StepItem[],
};

const MOCKED_COMPLETE_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2024',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2023',
  },
  steps: [
    {
      title: 'Attended day 1 of start-up training',
      subTitle: '22 Feb 2024',
      type: 'completed',
    },
  ] as StepItem[],
};

interface OnboardingInfoProps {
  setShowInfo: any;
}

export const OnboardingInfoPage: React.FC<OnboardingInfoProps> = ({
  setShowInfo,
}) => {
  const { isOnline } = useOnlineStatus();

  return (
    <BannerWrapper
      onBack={() => setShowInfo(false)}
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      title={'Onboarding'}
      backgroundColour={'white'}
      displayOffline={!isOnline}
    >
      <div className={'bg-white px-4'}>
        <Typography
          className="mt-4"
          text={'How to complete your onboarding journey'}
          type="h2"
        />
        <Typography
          className="mt-4"
          text={'To start a section, tap the item.'}
          type="body"
          color="textMid"
        />
        <div className="py-4 pt-4">
          <Steps
            items={MOCKED_INCOMPLETE_DATA.steps}
            typeColor={{ completed: 'successMain', todo: 'primaryAccent2' }}
          />
          <Typography
            className="-mt-4"
            color={'textMid'}
            type={'body'}
            text={`Complete each step by the deadline. Some steps can only be completed once previous steps are done.`}
          />
        </div>
        <Divider dividerType="dashed" />
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
      </div>
      <div className="mt-4 -mb-4 flex w-full justify-center self-end">
        <Button
          size="normal"
          className="mb-4 w-11/12"
          type="filled"
          color="primary"
          text="Go to onboarding journey"
          textColor="white"
          icon="ArrowCircleRightIcon"
          onClick={() => setShowInfo(false)}
        />
      </div>
    </BannerWrapper>
  );
};

export default OnboardingInfoPage;
