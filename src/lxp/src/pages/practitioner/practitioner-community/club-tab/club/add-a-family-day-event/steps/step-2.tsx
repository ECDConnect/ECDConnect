import { AttendanceStackedList, Checkbox, Typography } from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect } from 'react';

export const Step2 = ({ setIsEnabledButton }: AddMeetingProps) => {
  const mockedList = [1, 2, 3, 4, 5].map(() => ({
    title: '{practitionerName}',
    profileText: 'PN',
    attenendeeId: 'cf33ddcb-df65-472a-90c3-21aec50d83ba',
    avatarColor: '#D7D1E6',
    status: 1,
  }));

  useEffect(() => {
    // TODO: add integration
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Add a family day event for term 3" />
      <Typography
        className="mb-5"
        type="body"
        color="textMid"
        text={`August to October ${new Date().getFullYear()}`}
      />

      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Take practitioner attendance for the event"
      />
      <Typography
        type="body"
        color="textMid"
        className="mb-2"
        text="Tap a name to mark a practitioner absent"
      />
      <div className="mb-4">
        <AttendanceStackedList
          scroll={false}
          listItems={mockedList || []}
          onChange={() => {}}
        />
      </div>
      <Checkbox
        description={`Check to confirm that you have accurately captured practitioner attendance for the event ({count} practitioners attended).`}
        descriptionColor="textMid"
        // checked={}
        onCheckboxChange={() => {}}
      />
    </>
  );
};
