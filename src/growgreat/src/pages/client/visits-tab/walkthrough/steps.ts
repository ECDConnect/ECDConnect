import { Step } from 'react-joyride';

export const visitSteps: Step[] = [
  {
    target: '#walkthrough-contact-step-1',
    content: 'You can see the contact numbers here.',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-contact-step-2',
    content: "See your client's address here.",
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-contact-step-3',
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
