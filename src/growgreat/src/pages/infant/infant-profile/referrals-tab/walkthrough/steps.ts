import { Step } from 'react-joyride';

export const referralsSteps: Step[] = [
  {
    target: '#walkthrough-referrals-step-1',
    content:
      'After a visit, I will list all your referrals here! Once you have referred {client} on paper, tap the box.',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-referrals-step-2',
    content: 'Use this button to manage back-referrals',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-referrals-step-3',
    content:
      'Completed referrals will move here. You can update this at any time and the information will be shared with your Team Leader.',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-last-step',
    content: 'Great job, you’re ready to start!',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
];
