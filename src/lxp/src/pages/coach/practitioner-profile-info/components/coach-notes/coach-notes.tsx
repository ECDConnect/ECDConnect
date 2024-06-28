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
import { notesSelectors } from '@store/notes';
import { CreateNote } from '../create-note/create-note';
import * as styles from './coach-notes.styles';
import { ChildNotesRouteState } from './coach-notes.types';
import NotesList from './components/notes-list/notes-list';
import { ViewNote } from './components/view-note/view-note';
import { practitionerSelectors } from '@/store/practitioner';

export const CoachNotes: React.FC = () => {
  const history = useHistory();
  const location = useLocation<ChildNotesRouteState>();
  const [createChildNoteVisible, setCreateChildNoteVisible] =
    useState<boolean>(false);
  const [viewNoteVisible, setViewNoteVisible] = useState<boolean>(false);
  const [noteToView, setNoteToView] = useState<NoteDto>();

  const practitionerId = location.state.practitionerId;
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );

  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));
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
        title={`Notes for ${practitioner?.user?.fullName}`}
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
        <div className="flex justify-center">
          <NotesList
            className={'w-11/12 bg-white'}
            notes={notes}
            viewToNote={(note: NoteDto) => viewNote(note)}
          />
        </div>
        <FADButton
          title={'Add a note'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle
          type={'filled'}
          color={'quatenary'}
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
            userId={practitioner?.userId || ''}
            noteType={NoteTypeEnum.Child}
            titleText={`Add a note to ${practitioner?.user?.firstName} profile`}
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
