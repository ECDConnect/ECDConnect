import Joyride, { CallBackProps } from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { useAppContext } from './context';
import { useCallback, useEffect } from 'react';
import { Typography } from '@ecdlink/ui';
import ROUTES from './routes/routes';

export default function MultiRouteWrapper() {
  const history = useHistory();
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();

  useMount(() => {
    setState({
      steps: [
        {
          target: '#home',
          content: (
            <>
              <Typography
                text={'This is the home page'}
                type={'help'}
                color={'textMid'}
              />
              <Typography
                text={
                  "When you click 'next', it will stop the tour, navigate to route A, and continue the tour."
                }
                type={'help'}
                color={'textMid'}
              />
            </>
          ),
          disableBeacon: true,
        },
        {
          target: '#routeA',
          content: (
            <>
              <Typography
                text={'This is Route A'}
                type={'help'}
                color={'textMid'}
              />
              <Typography
                text={
                  ' The loader that appeared in the page was a simulation of a real page load, and now the tour is active again'
                }
                type={'help'}
                color={'textMid'}
              />
            </>
          ),
        },
        {
          target: '#routeB',
          content: (
            <>
              <Typography
                text={'This is Route B'}
                type={'help'}
                color={'textMid'}
              />
              <Typography
                text={
                  ' Yet another loader simulation and now we reached the last step in our tour!'
                }
                type={'help'}
                color={'textMid'}
              />
            </>
          ),
        },
      ],
    });
  });

  const navigate = useCallback(
    (location) => () => {
      history.push(location);
    },
    [history]
  );

  const handleCallback = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;

    if (type === 'step:after' && index === 0 /* or step.target === '#home' */) {
      setState({ run: false });

      history.push(ROUTES.ATTENDANCE_TUTORIAL_WALKTHROUGH);
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        setState({ run: false });
        navigate('/multi-route/b');
      } else {
        navigate('/multi-route');
        setState({ run: true, stepIndex: 0 });
      }
    } else if (type === 'step:after' && action === 'prev' && index === 2) {
      setState({ run: false });

      navigate('/multi-route/a');
    } else if (action === 'reset' || lifecycle === 'complete') {
      setState({ run: false, stepIndex: 0, tourActive: false });
    }
  };

  return (
    <div>
      <Joyride
        callback={handleCallback}
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            arrowColor: 'black',
            backgroundColor: 'black',
            primaryColor: 'primary',
            textColor: 'white',
          },
        }}
      />
    </div>
  );
}
