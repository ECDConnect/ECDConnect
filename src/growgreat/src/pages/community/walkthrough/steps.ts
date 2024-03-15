import { Step } from 'react-joyride';

export const COMMUNITY_WALKTHROUGH_STEPS = {
  ONE: 0,
  TWO: 1,
  THREE: 2,
  FOUR: 3,
  FIVE: 4,
  SIX: 5,
  SEVEN: 6,
  EIGHT: 7,
  NINE: 8,
};

export const communityWalkthroughSteps: Step[] = [
  {
    target: '#walkthrough-community-step-0',
    content: 'Tap here to see the league!',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'bottom',
  },
  {
    target: '#walkthrough-community-step-1',
    content: 'I’ll show you details about the league & each team’s position',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    placement: 'bottom',
  },
  {
    target: '#walkthrough-community-step-2',
    content: 'Tap here to see how your team earned points this quarter',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    spotlightClicks: true,
  },
  {
    target: '#walkthrough-community-step-3',
    content:
      'You can see how your team earned points & you can tap through to learn more',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-community-step-4',
    content: 'Back on the Team tab, you can see your team leader here',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-community-step-5',
    content: 'You can tap through here to see all your team members',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-community-step-6',
    content: 'You can tap through here manage your team’s breastfeeding clubs',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-community-step-7',
    content:
      'You can see all past breastfeeding clubs & add new breastfeeding clubs',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-last-step',
    content: 'Great job, you’re ready to start!',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    placement: 'bottom',
  },
];
