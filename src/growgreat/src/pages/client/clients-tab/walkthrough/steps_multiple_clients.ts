import { Step } from 'react-joyride';

export const multipleClientsSteps: Step[] = [
  {
    target: '#walkthrough-dashboard-client-multi-step-1',
    content: 'Tap here to find a type of client',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-dashboard-client-multi-step-2',
    content: "You can also search for a client's name here.",
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-dashboard-client-multi-step-3',
    content: 'Tap this button to open a folder for a new pregnant mom or child',
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
