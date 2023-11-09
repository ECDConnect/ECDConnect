import { BannerWrapper, Button, Divider, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import ROUTES from '@/routes/routes';
import { ClubsRouteState } from '@/pages/community/clubs-tab/index.types';
import { useEffect } from 'react';
import { getPointsActivityDateDetails } from '@/pages/community/clubs-tab/index.filters';
import { ActivityMeetRegularDetail } from '@ecdlink/graphql';

export const MeetingDetails: React.FC = () => {
  const { clubId, meetingId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );

  const history = useHistory();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const meetingDate = new Date(`${meetingId}T00:00:00`);

  const isUpcomingVisit = currentDate < meetingDate;

  const meeting = isUpcomingVisit
    ? details?.upcomingMeetings?.find((item) =>
        item?.meetingDate.includes(meetingId)
      )
    : details?.pastMeetings?.find((item) =>
        item?.meetingDate.includes(meetingId)
      );

  const { formattedDate } = getPointsActivityDateDetails(meeting?.meetingDate);

  useEffect(() => {
    if (!details) {
      history.push(
        ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
          ':clubId',
          clubId
        )
      );
    }
  }, [clubId, details, history]);

  const Item = ({ name }: { name: string }) => (
    <>
      <Typography type="body" className="py-2" text={name} />
      <Divider dividerType="dashed" />
    </>
  );

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={`${club?.name ?? ''} meeting`}
      subTitle={formattedDate}
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text={formattedDate} />
      {meeting?.meetingNotes && (
        <div className="bg-uiBg rounded-15 my-5 p-4">
          <Typography type="h3" text="Notes" />
          <Typography type="body" color="textMid" text={meeting.meetingNotes} />
        </div>
      )}
      {!isUpcomingVisit && meeting && (
        <>
          <Typography type="h2" className="mb-5" text="Attendance" />
          <div className="flex items-center gap-2">
            <p className="bg-successMain rounded-3xl px-2 py-1">
              {(meeting as ActivityMeetRegularDetail)?.meetingAttendancePerc}%
            </p>
            <Typography type="h4" text="club members attended:" />
          </div>
          {(meeting as ActivityMeetRegularDetail)?.meetingParticipants?.map(
            (member) => (
              <Item
                key={member?.id}
                name={`${member?.firstName} ${member?.surname}`}
              />
            )
          )}
          <Typography
            type="h4"
            text="These practitioners were absent:"
            className="mt-5 mb-2"
          />
          {(meeting as ActivityMeetRegularDetail)?.meetingAbsentees?.map(
            (member) => (
              <Item
                key={member?.id}
                name={`${member?.firstName} ${member?.surname}`}
              />
            )
          )}
        </>
      )}
      <Button
        className="mt-auto"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to club"
        onClick={() =>
          history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId))
        }
      />
    </BannerWrapper>
  );
};
