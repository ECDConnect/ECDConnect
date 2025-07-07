import ROUTES from '@/routes/routes';
import { Button, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';
import { ContactDialog } from '@/components/contact-dialog/contact-dialog';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';
import { useState } from 'react';

export const ProgressTabNoChildren: React.FC<{
  canAddChildren: boolean;
  isOnline: boolean;
  showOnlineOnly: () => void;
}> = ({ canAddChildren, isOnline, showOnlineOnly }) => {
  const history = useHistory();

  const classroom = useSelector(classroomsSelectors.getClassroom);

  const [showDialog, setShowDialog] = useState(false);

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
            setShowDialog(true);
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
