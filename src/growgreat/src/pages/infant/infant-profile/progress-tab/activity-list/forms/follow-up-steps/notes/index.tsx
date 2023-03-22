import { Button, FormInput, Typography } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { activitiesColours } from '../../../activities-list';
import { useLayoutEffect } from 'react';
import { DynamicFormProps } from '../../dynamic-form';

// TODO: add this rule (G8.5.1) ->
// If there are multiple clients associated with the same caregiver, show additional steps with the client’s name (first example is a pregnant mom)

export const NotesStep = ({ setEnableButton }: DynamicFormProps) => {
  const isPreviousNote = true;

  // TODO: add integration (G5.8.1)
  const mockedNote = {
    name: 'Notes from 12 March visit',
    type: 'formula milk only',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="DocumentTextIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Notes"
      />
      <div className="flex flex-col gap-4 p-4">
        <FormInput
          label="Fill in any observations or notes"
          subLabel="Optional"
          className={'mt-3'}
          textInputType="textarea"
          placeholder="E.g. Mom and baby seem happy and healthy."
        />
        {isPreviousNote && (
          <>
            <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
              <Typography type="h3" text={mockedNote.name} color="textDark" />

              <Typography type="body" text={mockedNote.note} color="textMid" />
            </div>
            <Button
              type="outlined"
              color="primary"
              textColor="primary"
              text="See previous notes"
              icon="DocumentTextIcon"
            />
          </>
        )}
      </div>
    </>
  );
};
