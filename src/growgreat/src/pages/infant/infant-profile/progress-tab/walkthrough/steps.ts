import { Step } from 'react-joyride';

export const progressSteps: Step[] = [
  {
    target: '#walkthrough-progress-step-1',
    content:
      'I’ll show you a score at the top to let you know how your client is doing!',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-progress-step-2',
    content:
      'If your client needs support or a referral, I’ll highlight that for you',
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
