import { CLIENT_TABS } from '@/pages/client/client-dashboard/class-dashboard';
import ROUTES from '@/routes/routes';
import { ActionModal } from '@ecdlink/ui';
import { useHistory } from 'react-router';

interface MenuModalProps {
  onClose: () => void;
  showNewFolderDialog: () => void;
}

export const MenuModal = ({ onClose, showNewFolderDialog }: MenuModalProps) => {
  const history = useHistory();

  return (
    <ActionModal
      className="z-50"
      title="What do you want to do?"
      actionButtons={[
        {
          colour: 'primary',
          text: 'Visit clients',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'HomeIcon',
          onClick: () => {
            onClose();
            history.push(ROUTES.CLIENTS.ROOT, {
              activeTabIndex: CLIENT_TABS.VISIT,
            });
          },
        },
        {
          colour: 'primary',
          text: 'Find a client folder',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'FolderOpenIcon',
          onClick: () => {
            onClose();
            history.push(ROUTES.CLIENTS.ROOT, {
              activeTabIndex: CLIENT_TABS.CLIENT,
              isFindClient: true,
            });
          },
        },
        {
          colour: 'primary',
          text: 'Open a new folder',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'FolderAddIcon',
          onClick: () => {
            onClose();
            showNewFolderDialog();
          },
        },
        {
          colour: 'primary',
          text: 'See my highlights',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'PresentationChartLineIcon',
          onClick: () => {
            onClose();
            history.push(ROUTES.CLIENTS.ROOT, {
              activeTabIndex: CLIENT_TABS.HIGHLIGHTS,
            });
          },
        },
        {
          colour: 'primary',
          text: 'Something else',
          textColour: 'primary',
          type: 'outlined',
          onClick: () => {
            onClose();
            history.push(ROUTES.CLIENTS.ROOT, {
              activeTabIndex: CLIENT_TABS.CLIENT,
            });
          },
        },
      ]}
    />
  );
};
