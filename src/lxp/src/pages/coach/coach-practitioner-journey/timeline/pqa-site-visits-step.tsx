import { Visit, Maybe } from '@ecdlink/graphql';
import { dateOptions, getStepType } from './timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';

interface PQAVisitsProps {
  isLoading: boolean;
  visits: Maybe<Visit>[];
  currentVisit: Maybe<Visit>;
  currentVisitEventId: string | undefined;
  isOnline: boolean;
  onView: (visit: Visit) => void;
  onScheduleOrStart: (visit: Visit, visitEventId?: string) => void;
}

export const PQAVisits = ({
  visits,
  currentVisit,
  currentVisitEventId,
  isOnline,
  isLoading,
  onScheduleOrStart,
}: PQAVisitsProps) => {
  return (
    <>
      {visits?.map((item) => {
        return (
          <div className="my-4" key={item?.id}>
            <div className="relative flex items-center gap-1">
              <span>
                <CalendarIcon className="text-primary h-4 w-4" />
              </span>
              <Typography
                type="body"
                color="textDark"
                className="w-6/12 font-bold"
                text={item?.visitType?.description || ''}
              />
              {item?.id === currentVisit?.id && (
                <Button
                  style={{
                    position: 'absolute',
                    right: -36,
                  }}
                  className="z-50 w-32"
                  textColor="primary"
                  type="outlined"
                  color="primary"
                  text="Schedule"
                  iconPosition="start"
                  icon="CalendarIcon"
                  onClick={() =>
                    onScheduleOrStart(item as Visit, currentVisitEventId)
                  }
                />
              )}
            </div>
            <Typography
              type="body"
              // TODO: add schedule integration
              color={getStepType(String('Success'))?.color || 'textMid'}
              text={
                !!item?.plannedVisitDate
                  ? `${!!currentVisitEventId ? 'Scheduled' : 'By'} ${new Date(
                      item.plannedVisitDate
                    ).toLocaleDateString('en-ZA', dateOptions)}`
                  : ''
              }
            />
          </div>
        );
      })}
    </>
  );
};
