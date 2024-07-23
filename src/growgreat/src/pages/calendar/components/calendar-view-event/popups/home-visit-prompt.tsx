import { Dialog, DialogPosition } from '@ecdlink/ui';
import { HomeVisitPromptInfant } from './home-visit-prompt-infant';
import { HomeVisitPromptMom } from './home-visit-prompt-mom';

interface HomeVisitPromptProps {
  client: { id?: string; type?: string };
  visible: boolean;
  startVisit: (type: 'planned' | 'other') => void;
}

export const HomeVisitPrompt = (props: HomeVisitPromptProps) => {
  const renderPrompt = () => {
    if (!!props.client.id && props.visible) {
      if (props.client.type === 'infant') {
        return (
          <HomeVisitPromptInfant
            clientId={props.client.id}
            startVisit={props.startVisit}
          />
        );
      }
      if (props.client.type === 'mother') {
        return (
          <HomeVisitPromptMom
            clientId={props.client.id}
            startVisit={props.startVisit}
          />
        );
      }
    }
    return <></>;
  };

  return (
    <Dialog
      className={'mb-16 px-4'}
      visible={props.visible}
      position={DialogPosition.Middle}
      stretch={false}
      zIndex={2000}
    >
      {renderPrompt()}
    </Dialog>
  );
};
