import {
  BannerWrapper,
  Button,
  Colours,
  Divider,
  EmptyPage,
  ScoreCard,
  StackedList,
  StackedListType,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../../../individual-club-view';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { Header } from '../0-components/header';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import { ClubMember, Maybe } from '@ecdlink/graphql';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';

export const LeaveNoOneBehind: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const activityId = 'leave-no-one-behind';

  const mockedPoints = 20;

  const mapMember = (member: Maybe<ClubMember>): UserAlertListDataItem => ({
    title: `${member?.practitioner?.user?.firstName || ''} ${
      member?.practitioner?.user?.surname || ''
    }`,
    profileText: `${member?.practitioner?.user?.firstName?.charAt(
      0
    )}${member?.practitioner?.user?.surname?.charAt(0)}`,
    titleStyle: 'text-textDark',
    avatarColor: 'var(--primaryAccent2)',
    subTitle: member?.welcomeMessage || '',
    subTitleStyle: 'text-infoDark',
    profileDataUrl: member?.practitioner?.user?.profileImageUrl || '',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.MEMBER.replace(
          ':clubId',
          clubId
        ).replace(':practitionerId', member?.practitioner?.id)
      ),
  });

  const mappedMembers = club?.clubMembers?.map(mapMember) ?? [];
  // TODO: replace slice with real pqa data
  const membersWithGreenPqa = mappedMembers?.slice(0, 1) ?? [];
  const membersWithOrangePqa = mappedMembers?.slice(2, 3) ?? [];
  const membersWithRedPqa = mappedMembers?.slice(4, 5) ?? [];
  const membersWithPqaComingUp = mappedMembers?.slice(6, 8) ?? [];

  const hasItems = !!mappedMembers.length;

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayHelp
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP.replace(':clubId', clubId).replace(
            ':activityId',
            activityId
          )
        )
      }
    >
      <Header
        // TODO: change to activity date
        date={new Date()}
        imageUrl={inclusiveIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        mainText={String(mockedPoints)}
        hint="points"
        currentPoints={mockedPoints}
        maxPoints={800}
        barBgColour="uiLight"
        barColour={
          isCurrentPointsAtLeast80PercentOfTotal(
            club?.totalClubPoints || 0,
            club?.maxClubPoints || 0
          )
            ? 'successMain'
            : 'secondary'
        }
        bgColour="uiBg"
        textColour="black"
      />
      {hasItems ? (
        <div className="my-5">
          {['green', 'orange', 'red', 'comingUp'].map((item, index) => {
            let members = [];
            let color: Colours = 'textDark';

            switch (item) {
              case 'green':
                members = membersWithGreenPqa;
                color = 'successDark';
                break;
              case 'orange':
                members = membersWithOrangePqa;
                color = 'alertDark';
                break;
              case 'red':
                members = membersWithRedPqa;
                color = 'errorDark';
                break;
              default:
                members = membersWithPqaComingUp;
                break;
            }
            if (!members.length) return <></>;

            return (
              <>
                {index !== 0 && (
                  <Divider dividerType="dashed" className="my-4" />
                )}
                <p className="text-18 text-textDark mb-3 font-semibold">
                  SmartStarters with{' '}
                  {item.includes('coming') ? (
                    'PQAs coming up later this year'
                  ) : (
                    <>
                      <span className={`text-${color}`}>{item}</span> PQA
                    </>
                  )}
                  :
                </p>
                <StackedList
                  className="flex flex-col gap-2"
                  isFullHeight={false}
                  type={'UserAlertList' as StackedListType}
                  listItems={members}
                />
              </>
            );
          })}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="This club has not submitted any family days yet this year!"
          subTitle=""
        />
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
