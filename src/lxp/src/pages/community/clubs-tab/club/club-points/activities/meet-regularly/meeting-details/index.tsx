import { BannerWrapper, Button, Divider, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { format } from 'date-fns';
import ROUTES from '@/routes/routes';
import { ClubsRouteState } from '@/pages/community/clubs-tab/index.types';

export const MeetingDetails: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const mockedData = {
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    members: [
      { attended: true, name: 'Cynthia Jacobs' },
      { attended: true, name: 'Lerato Setsego' },
      { attended: true, name: 'Palesa Ndlovu' },
      { attended: true, name: 'Hope Mokoena' },
      { attended: false, name: 'Bulelwa Mahlangu' },
    ],
  };

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
      // TODO: change to meeting date
      subTitle={format(new Date(), 'dd MMMM yyyy')}
      onBack={() => history.goBack()}
    >
      {/* TODO: change to meeting date */}
      <Typography type="h2" text={format(new Date(), 'dd MMMM yyyy')} />
      <div className="bg-uiBg rounded-15 my-5 p-4">
        <Typography type="h3" text="Notes" />
        <Typography type="body" color="textMid" text={mockedData.note} />
      </div>
      <Typography type="h2" className="mb-5" text="Attendance" />
      <div className="flex items-center gap-2">
        <p className="bg-successMain rounded-3xl px-2 py-1">00%</p>
        <Typography type="h4" text="club members attended:" />
      </div>
      {mockedData.members
        .filter((member) => member.attended)
        .map((member) => (
          <Item key={member.name} name={member.name} />
        ))}
      <Typography
        type="h4"
        text="These practitioners were absent:"
        className="mt-5 mb-2"
      />
      {mockedData.members
        .filter((member) => !member.attended)
        .map((member) => (
          <Item key={member.name} name={member.name} />
        ))}
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
