import { getClientPlannedCurrentVisit } from '@/pages/client/visits-tab/start-visit/start-visit.utils';
import { useAppDispatch } from '@/store';
import { getDateWithoutTimeZone } from '@ecdlink/core';
import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useEffect, useState } from 'react';

interface HomeVisitPromptProps {
  client: { id?: string; type?: string };
  visible: boolean;
  startVisit: (type: '2month' | 'other') => void;
}

export const HomeVisitPrompt = (props: HomeVisitPromptProps) => {
  const appDispatch = useAppDispatch();
  const [actionButtons, setActionButtons] = useState<ActionModalButton[]>([]);

  useEffect(() => {
    const buttonOther = {
      text: 'Other',
      textColour: 'primary',
      colour: 'primary',
      type: 'outlined',
      onClick: async () => await props.startVisit('other'),
      leadingIcon: 'ClipboardListIcon',
    } as ActionModalButton;
    if (
      !props.client.id &&
      props.client.type !== 'infant' &&
      props.client.type !== 'mother'
    ) {
      setActionButtons([buttonOther]);
      return;
    }
    (async () => {
      const nextVisit = await getClientPlannedCurrentVisit(
        {
          id: props.client.id || '',
          type: props.client.type as 'mother' | 'infant',
        },
        appDispatch
      );
      const buttons: ActionModalButton[] = [];
      if (!!nextVisit) {
        buttons.push({
          text: nextVisit.visitType?.normalizedName || '',
          textColour: 'primary',
          colour: 'primary',
          type: 'outlined',
          onClick: async () => await props.startVisit('2month'),
          leadingIcon: 'PresentationChartBarIcon',
        });
      }
      buttons.push(buttonOther);
      setActionButtons(buttons);
    })();
  }, [props.client.id]);

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
        actionButtons={actionButtons}
      />
    </Dialog>
  );
};
