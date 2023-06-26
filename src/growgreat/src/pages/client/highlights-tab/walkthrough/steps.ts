import { Step } from 'react-joyride';

export const highlightSteps: Step[] = [
  {
    target: '#walkthrough-highlights-step-1',
    content: 'You can see the contact numbers here.',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-highlights-step-2',
    content: "See your client's address here.",
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-highlights-step-3',
    content: "If the client's info changes, you can update it here.",
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
