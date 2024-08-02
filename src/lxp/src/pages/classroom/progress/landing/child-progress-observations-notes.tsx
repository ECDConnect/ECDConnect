import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import ROUTES from '@/routes/routes';

export type ChildProgressObservationsNotesState = {
  childId: string;
};

export const ChildProgressObservationsNotes: React.FC = () => {
  const history = useHistory();

  const { state: routeState } =
    useLocation<ChildProgressObservationsNotesState>();

  const { child, currentReport, updateNotes } = useObserveProgressForChild(
    routeState.childId
  );

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
          onChange={(event) => updateNotes(event.target.value)}
          value={currentReport?.notes}
        />
        <Button
          onClick={() =>
            history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: routeState.childId,
            })
          }
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="SaveIcon"
          text="Save"
          textColor="white"
          disabled={!currentReport?.notes}
        />
      </div>
    </BannerWrapper>
  );
};
