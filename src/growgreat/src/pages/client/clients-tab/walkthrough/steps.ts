import { Step } from 'react-joyride';

export const clientSteps: Step[] = [
  {
    target: '#walkthrough-dashboard-client-step-1',
    content:
      'Use the tabs to see your clients, visits, or your weekly highlights',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
    disableBeacon: true,
  },
  {
    target: '#walkthrough-dashboard-client-step-2',
    content:
      'On the clients tab, you can see all of the clients you have registered on CHW Connect',
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
