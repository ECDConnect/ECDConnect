import { NoteDto } from '@ecdlink/core';
import { StackedList, ActionListDataItem } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { NotesListProps } from './notes-list.types';

export const NotesList = ({
  notes,
  className,
  handleListScroll,
  viewToNote,
}: NotesListProps) => {
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);

  useEffect(() => {
    const notesList: ActionListDataItem[] = notes.map((note) => {
      return {
        title: format(new Date(note.insertedDate), 'dd MMM yyyy'),
        subTitle: note.name,
        switchTextStyles: true,
        actionName: 'View',
        actionIcon: 'EyeIcon',
        onActionClick: () => {
          viewNote(note);
        },
      };
    });

    setListItems(notesList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const viewNote = (note: NoteDto) => {
    if (viewToNote) {
      viewToNote(note);
    }
  };

  return (
    <div className={className}>
      {listItems && (
        <StackedList
          listItems={listItems}
          type={'ActionList'}
          onScroll={(scrollTop: number) =>
            handleListScroll && handleListScroll(scrollTop)
          }
        ></StackedList>
      )}
    </div>
  );
};

export default NotesList;
