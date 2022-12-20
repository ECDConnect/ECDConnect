import { NoteDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  Typography,
  renderIcon,
  classNames,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useAppDispatch } from '@store';
import { notesActions } from '@store/notes';
import { ViewNoteProps } from './view-note.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const ViewNote: React.FC<ViewNoteProps> = ({
  note,
  onDelete,
  onBack,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const handleDelete = async (deletedNote: NoteDto) => {
    appDispatch(notesActions.deleteNote(deletedNote));

    if (onDelete) {
      onDelete(deletedNote);
    }

    onBack && onBack();
  };

  const deletePrompt = (deletedNote: NoteDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to delete this note?`}
          actionButtons={[
            {
              text: 'Delete',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                submit();
                handleDelete(deletedNote);
              },
              leadingIcon: 'TrashIcon',
            },
            {
              text: 'Cancel',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: cancel,
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      backgroundColour={'uiBg'}
      renderBorder={true}
      title={note.name}
      color={'primary'}
      onBack={() => onBack && onBack()}
      displayOffline={!isOnline}
    >
      <div className={'overflow-auto px-4 pb-4'}>
        <Typography
          type={'h1'}
          text={note.name}
          color={'primary'}
          className={'w-full break-words pt-1'}
        />
        {note.insertedDate && (
          <Typography
            type={'h3'}
            text={format(new Date(note.insertedDate), 'dd MMM yyyy')}
            color={'textMid'}
          />
        )}
        <Typography
          type={'body'}
          text={note.bodyText}
          color={'textMid'}
          className={'break-words pt-4'}
        />
        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={() => deletePrompt(note)}
          className="w-full"
          size="small"
          color="errorDark"
          type="filled"
        >
          {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
          <Typography
            type="h6"
            className="ml-2"
            text="Delete note"
            color="white"
          />
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default ViewNote;
