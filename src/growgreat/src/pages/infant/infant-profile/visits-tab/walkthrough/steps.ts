import { Step } from 'react-joyride';

export const visitSteps: Step[] = [
  {
    target: '#walkthrough-visit-step-1',
    content:
      'You can use the tabs at the top to see different parts of your client’s profile',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-visit-step-2',
    content: 'You can see & start your visits on the visits tab!',
    disableOverlayClose: true,
    disableCloseOnEsc: true,
  },
  {
    target: '#walkthrough-visit-step-3',
    content:
      'Use this button if something happens, like a baby is born, a new pregnancy, or something else.',
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
