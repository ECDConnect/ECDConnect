import { Step } from 'react-joyride';
import communityWalkthrough from '@/i18n/modules/community/walkthrough/en-za.json';

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
    content: communityWalkthrough['Tap here to see the league!'],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
    spotlightClicks: true,
    placement: 'bottom',
  },
  {
    target: '#walkthrough-community-step-1',
    content:
      communityWalkthrough[
        'I’ll show you details about the league & each team’s position'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '#walkthrough-community-step-2',
    content:
      communityWalkthrough[
        'Tap here to see how your team earned points this quarter'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    spotlightClicks: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-community-step-3',
    content:
      communityWalkthrough[
        'You can see how your team earned points & you can tap through to learn more'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-community-step-4',
    content:
      communityWalkthrough[
        'Back on the Team tab, you can see your team leader here'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-community-step-5',
    content:
      communityWalkthrough[
        'You can tap through here to see all your team members'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-community-step-6',
    content:
      communityWalkthrough[
        'You can tap through here manage your team’s breastfeeding clubs'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-community-step-7',
    content:
      communityWalkthrough[
        'You can see all past breastfeeding clubs & add new breastfeeding clubs'
      ],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-last-step',
    content: communityWalkthrough['Great job, you’re ready to start!'],
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    placement: 'bottom',
    disableBeacon: true,
  },
];
