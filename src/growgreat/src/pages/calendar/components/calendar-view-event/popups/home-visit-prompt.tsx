import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';

interface HomeVisitPromptProps {
  visible: boolean;
  actionButtons: ActionModalButton[];
}

export const HomeVisitPrompt = (props: HomeVisitPromptProps) => {
  return (
    <Dialog
      className={'mb-16 px-4'}
      visible={props.visible}
      position={DialogPosition.Middle}
      stretch={false}
      zIndex={2000}
    >
      <ActionModal
        importantText={`Which visit would you like to complete?`}
        actionButtons={props.actionButtons}
      />
    </Dialog>
  );
};
