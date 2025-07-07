import ROUTES from '@/routes/routes';
import { Button, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';
import { ContactDialog } from '@/components/contact-dialog/contact-dialog';
import { useState } from 'react';
import { classroomsSelectors } from '@/store/classroom';
import { useSelector } from 'react-redux';

export const ProgressTabAllChildrenOverFive: React.FC<{
  canAddChildren: boolean;
  isOnline: boolean;
  showOnlineOnly: () => void;
}> = ({ canAddChildren, isOnline, showOnlineOnly }) => {
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <Emoji4Icon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text="You don't have any children under 5 years old!"
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text={
          canAddChildren
            ? "We don't have a progress tracker for children over 5 years old yet. Add children who are 5 years old or younger"
            : "We don't have a progress tracker for children over 5 years old yet. Ask your principal to add children who are 5 years old or younger"
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
            setShowDialog(true);
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
      <Dialog fullScreen visible={showDialog} position={DialogPosition.Top}>
        <ContactDialog
          firstName={classroom!.principal.firstName}
          phoneNumber={classroom!.principal.phoneNumber}
          whatsAppNumber={classroom!.principal.phoneNumber}
          title={`${classroom!.principal.firstName} ${
            classroom!.principal.surname ?? ''
          }`}
          onClose={() => {
            setShowDialog(false);
          }}
        ></ContactDialog>
      </Dialog>
    </div>
  );
};
