import { Visit, Maybe } from '@ecdlink/graphql';
import { dateOptions, getStepType } from './timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';

interface PQAVisitsProps {
  isLoading: boolean;
  visits: Maybe<Visit>[];
  currentVisit: Maybe<Visit>;
  isOnline: boolean;
  onView: (visit: Visit) => void;
  onStart: (visitName: string) => void;
}

export const PQAVisits = ({
  visits,
  currentVisit,
  isOnline,
  isLoading,
  onStart,
}: PQAVisitsProps) => (
  <>
    {visits?.map((item) => (
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
          {item?.id === currentVisit?.id /* && !item?.attended  */ && (
            <Button
              style={{
                position: 'absolute',
                right: -36,
              }}
              className="z-50 w-24"
              textColor="white"
              type="filled"
              color="primary"
              text="Start"
              iconPosition="end"
              icon="ArrowCircleRightIcon"
              onClick={() => onStart(item?.visitType?.name!)}
            />
          )}
        </div>
        <Typography
          type="body"
          // TODO: add schedule integration
          color={getStepType(String('Success'))?.color || 'textMid'}
          text={
            !!item?.plannedVisitDate
              ? `By ${new Date(item.plannedVisitDate).toLocaleDateString(
                  'en-ZA',
                  dateOptions
                )}`
              : ''
          }
        />
      </div>
    ))}
  </>
);
