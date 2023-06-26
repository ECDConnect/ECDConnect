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
    content: 'Tap "Pregnant mom" to see all your pregnant mom clients',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-dashboard-client-step-2',
    content: 'Now you will see only pregnant moms in your list',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-dashboard-client-multi-step-4',
    content: "You can also search for a client's name here.",
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-dashboard-client-multi-step-5',
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
