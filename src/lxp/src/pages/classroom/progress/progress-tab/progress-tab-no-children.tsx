import ROUTES from '@/routes/routes';
import { Button, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';

export const ProgressTabNoChildren: React.FC<{
  canAddChildren: boolean;
  isOnline: boolean;
  showOnlineOnly: () => void;
}> = ({ canAddChildren, isOnline, showOnlineOnly }) => {
  const history = useHistory();

  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <Emoji4Icon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text="You don't have any children yet!"
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text={
          canAddChildren
            ? 'Add children to get started'
            : 'Ask your principal to assign you to a class & add children'
        }
        type={'body'}
      />
      <Button
        onClick={() => {
          if (canAddChildren) {
            if (isOnline) {
              history.push(ROUTES.CHILD_REGISTRATION_LANDING);
            } else {
              showOnlineOnly();
            }
          } else {
            // TODO - Need an actual proper way to do this...
            // Current implementation from the practitioner list is complicated,
            // requires you to be online and works in a dialog not a specific page we can redirect to
          }
        }}
        className="mt-4 w-full"
        size="small"
        color="quatenary"
        textColor="white"
        type="filled"
        icon={canAddChildren ? 'PlusIcon' : 'ChatAlt2Icon'}
        text={canAddChildren ? 'Add children' : 'Contact Principal'}
      />
    </div>
  );
};
