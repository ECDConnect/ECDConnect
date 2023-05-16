import { useTheme } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Divider,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { format } from 'date-fns';

const MOCKED_DATA = {
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
    {
      title: 'Starter licence',
      subTitle: '25 Feb 2020',
      type: 'completed',
    },
    {
      title: 'Consolidation meeting scheduled',
      subTitle: '10 Mar 2020',
      type: 'todo',
      icon: 'CalendarIcon',
    },
    {
      title: 'Fill in the SmartSpace checklist',
      subTitle: '5 Mar 2020',
      type: 'todo',
    },
    {
      title: 'Get community support',
      subTitle: '25 Aug 2020',
      type: 'todo',
    },
    {
      title: 'Register 3 children',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
    {
      title: 'SmartSpace visit from coach',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
    {
      title: 'Sign franchisee agreement',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
    {
      title: 'Sign start-up support agreement',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
  ] as StepItem[],
};

export const TraineeOnboarding = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={date}
      color={'primary'}
      onBack={history.goBack}
      displayHelp={true}
      onHelp={() => {}}
      displayOffline={!isOnline}
    >
      <div className="bg-uiBg flex w-full items-center justify-center">
        <Typography
          className={'my-3'}
          color={'primary'}
          type={'h3'}
          text={'Onboarding'}
        />
      </div>
      <div className="p-4">
        <Typography
          className={'my-3'}
          color={'textDark'}
          type={'h2'}
          text={'Trainee onboarding'}
        />
        <Typography
          className={'my-3 w-11/12'}
          color={'textDark'}
          type={'h3'}
          text={'Complete all the steps to set up your programme'}
        />
        <Divider dividerType="dashed" className="my-2" />
        <Steps
          items={MOCKED_DATA.steps}
          typeColor={{ completed: 'successMain' }}
        />
      </div>
    </BannerWrapper>
  );
};
