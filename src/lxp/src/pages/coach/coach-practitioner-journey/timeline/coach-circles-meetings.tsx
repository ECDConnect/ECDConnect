import { Visit, PractitionerTimeline } from '@ecdlink/graphql';
import { dateOptions, getStepType } from './timeline-steps';
import { Typography } from '@ecdlink/ui';
import { format } from 'date-fns';

interface SupportVisitsProps {
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  onView?: (visit: Visit) => void;
}

export const CoachCirclesMeeting = ({
  timeline,
  isOnline,
  isLoading,
  onView,
}: SupportVisitsProps) => (
  <>
    {timeline?.coachCircles?.meetingRegister?.map((item) => (
      <div className="my-4" key={item?.id}>
        <div className="relative flex items-center gap-2">
          {item?.attended === true ? (
            <span>
              <div className="bg-successMain h-2 w-2 rounded-full"></div>
            </span>
          ) : (
            <span>
              <div className="bg-errorMain h-2 w-2"></div>
            </span>
          )}
          <Typography
            type="body"
            color="textDark"
            className="w-full font-semibold"
            text={
              item?.attended === true
                ? `${format(
                    new Date(item?.clubMeeting?.meetingDate),
                    'MMMM'
                  )} meeting attended`
                : `${format(
                    new Date(item?.clubMeeting?.meetingDate),
                    'MMMM'
                  )} meeting missed` || ''
            }
          />
        </div>
        <Typography
          type="body"
          // TODO: add schedule integration
          color={getStepType(String('Success'))?.color || 'textMid'}
          text={
            !!item?.clubMeeting
              ? `${new Date(item.clubMeeting?.meetingDate).toLocaleDateString(
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
