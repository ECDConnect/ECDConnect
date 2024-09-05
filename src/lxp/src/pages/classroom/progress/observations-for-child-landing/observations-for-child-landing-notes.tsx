import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import ROUTES from '@/routes/routes';
import { useState } from 'react';

export type ObservationsForChildNotesState = {
  childId: string;
};

export const ObservationsForChildNotes: React.FC = () => {
  const history = useHistory();

  const { state: routeState } = useLocation<ObservationsForChildNotesState>();

  const { child, currentReport, updateNotes } = useObserveProgressForChild(
    routeState.childId
  );

  const [notes, setNotes] = useState<string>(currentReport?.notes || '');

  return (
    <BannerWrapper
      size={'small'}
      onBack={() => history.goBack()}
      title={`Add a note about ${child?.user?.firstName}`}
      renderOverflow
    >
      <div className="flex h-full flex-col px-4 pt-4">
        <Typography type="h2" color="primary" text={'Your notes'} />
        <FormInput
          label={`Fill in any observations or notes about ${child?.user?.firstName}. These notes will not be shared with ${child?.user?.firstName}'s caregiver.`}
          textInputType="textarea"
          placeholder={
            'E.g. Group to share ball, take turns to kick ball, score goals, catch, throw'
          }
          className="mt-2"
          onChange={(event) => setNotes(event.target.value)}
          value={notes}
        />
        <Button
          onClick={() => {
            updateNotes(notes);
            history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: routeState.childId,
            });
          }}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="SaveIcon"
          text="Save"
          textColor="white"
          disabled={!notes}
        />
      </div>
    </BannerWrapper>
  );
};
