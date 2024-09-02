import { NoteDto } from '@ecdlink/core';
import { NoteTypeEnum } from '@ecdlink/graphql';
import {
  BannerWrapper,
  Dialog,
  DialogPosition,
  FADButton,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { childrenSelectors } from '@store/children';
import { notesSelectors } from '@store/notes';
import { CreateNote } from '../components/create-note/create-note';
import * as styles from './child-notes.styles';
import { ChildNotesRouteState } from './child-notes.types';
import NotesList from './components/notes-list/notes-list';
import { ViewNote } from './components/view-note/view-note';

export const ChildNotes: React.FC = () => {
  const history = useHistory();
  const location = useLocation<ChildNotesRouteState>();
  const [createChildNoteVisible, setCreateChildNoteVisible] =
    useState<boolean>(false);
  const [viewNoteVisible, setViewNoteVisible] = useState<boolean>(false);
  const [noteToView, setNoteToView] = useState<NoteDto>();

  const childId = location?.state?.childId;
  const child = useSelector(childrenSelectors.getChildById(childId));

  const notes = useSelector(notesSelectors.getNotesByUserId(child?.userId));
  const { isOnline } = useOnlineStatus();

  const openCreateNote = () => {
    setCreateChildNoteVisible(true);
  };

  const onCreateChildNoteBack = () => {
    setCreateChildNoteVisible(false);
  };

  const viewNote = (note: NoteDto) => {
    setNoteToView(note);
    setViewNoteVisible(true);
  };

  const onNoteCreated = () => {
    setCreateChildNoteVisible(false);
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`Notes for ${child?.user?.firstName}`}
        color={'primary'}
        onBack={history.goBack}
        displayOffline={!isOnline}
      >
        <Typography
          className={'px-4 pt-1'}
          type={'h1'}
          color={'primary'}
          text="Notes"
        />
        <NotesList
          className={'w-full bg-white px-4'}
          notes={notes}
          viewToNote={(note: NoteDto) => viewNote(note)}
        />
        <FADButton
          title={'Add a note'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle
          type={'filled'}
          color={'secondary'}
          shape={'round'}
          className={styles.fadButton}
          click={() => openCreateNote()}
        />
      </BannerWrapper>
      <Dialog
        fullScreen
        visible={createChildNoteVisible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <CreateNote
            userId={child?.userId || ''}
            noteType={NoteTypeEnum.Child}
            titleText={`Add a note to ${child?.user?.firstName} profile`}
            onBack={() => onCreateChildNoteBack()}
            onCreated={() => onNoteCreated()}
          />
        </div>
      </Dialog>

      <Dialog
        stretch={true}
        fullScreen={true}
        visible={viewNoteVisible}
        position={DialogPosition.Middle}
      >
        {noteToView && (
          <ViewNote
            note={noteToView}
            onBack={() => setViewNoteVisible(false)}
          />
        )}
      </Dialog>
    </>
  );
};
