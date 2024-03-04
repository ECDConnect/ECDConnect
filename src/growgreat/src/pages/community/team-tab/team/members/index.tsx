import ROUTES from '@/routes/routes';
import { communitySelectors } from '@/store/community';
import {
  BannerWrapper,
  Button,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const TeamMembers = () => {
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const history = useHistory();

  const leaders: UserAlertListDataItem[] =
    clinicDetails?.teamLeads?.map((leader) => ({
      title: `${leader.firstName ?? ''} ${leader.surname ?? ''}`,
      titleStyle: 'text-textDark',
      subTitle: leader.welcomeMessage ?? '',
      subTitleStyle: 'text-infoDark',
      profileDataUrl: '',
      profileText: `${leader.firstName.charAt(0)}${leader.surname.charAt(0)}`,
      avatarColor: 'var(--primaryAccent2)',
      alertSeverity: 'none',
      hideAlertSeverity: true,
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.TEAM.MEMBERS.LEADER_PROFILE.replace(
            ':leaderId',
            leader.id
          )
        ),
    })) ?? [];

  const members: UserAlertListDataItem[] =
    clinicDetails?.clinicMembers?.map((member) => ({
      title: `${member.firstName ?? ''} ${member.surname ?? ''}`,
      titleStyle: 'text-textDark',
      subTitle: member?.welcomeMessage ?? '',
      subTitleStyle: 'text-infoDark',
      profileDataUrl: '',
      profileText: `${member.firstName.charAt(0)}${member.surname.charAt(0)}`,
      avatarColor: 'var(--primaryAccent2)',
      alertSeverity: 'none',
      hideAlertSeverity: true,
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.TEAM.MEMBERS.MEMBER_PROFILE.replace(
            ':memberHealthCareWorkerId',
            member.healthCareWorkerId
          )
        ),
    })) ?? [];

  return (
    <BannerWrapper
      size="small"
      title={`${clinicDetails?.name} team members`}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
      className="flex h-full flex-col p-4 pt-6"
    >
      <Typography type="h2" text={`${clinicDetails?.name} team members`} />
      {!!leaders.length && (
        <>
          <Typography
            className="mb-2 mt-6"
            type="h3"
            text={`Team leader${leaders.length > 1 ? 's' : ''}`}
          />
          <div className="mb-4">
            <StackedList
              className="flex flex-col gap-2"
              isFullHeight={false}
              type={'UserAlertList' as StackedListType}
              listItems={leaders}
            />
          </div>
        </>
      )}
      <Typography className="mb-2 mt-6" type="h3" text="Team members" />
      <div className="mb-4">
        <StackedList
          className="flex flex-col gap-2"
          isFullHeight={false}
          type={'UserAlertList' as StackedListType}
          listItems={members}
        />
      </div>
      <Button
        className="mt-auto flex"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to team"
        onClick={() => history.push(ROUTES.COMMUNITY.ROOT)}
      />
    </BannerWrapper>
  );
};
