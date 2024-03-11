import { Fragment, useMemo } from 'react';
import { ClinicDetailsProps } from './clinic-details.types';
import { BannerWrapper, Button, Typography, Divider, Alert } from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import WhatsLogo from '../../../../../assets/whatsgg.svg';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import { formatPhoneNumber, useSnackbar } from '@ecdlink/core';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CommunityActions } from '@/store/community/community.actions';
import { NoCommunityFound } from '@/pages/community/0-components/no-community-found';
import { MemberProfileRouteState } from '@/pages/community/team-tab/team/members/member-profile/types';

export const ClinicDetails: React.FC<ClinicDetailsProps> = ({
  setClinicDetails,
}) => {
  const { isOnline } = useOnlineStatus();

  const { showMessage } = useSnackbar();

  const history = useHistory();

  const { isLoading: isLoadingClinic } = useThunkFetchCall(
    'community',
    CommunityActions.GET_CLINIC_BY_ID
  );

  const clinic = useSelector(communitySelectors.getClinicSelector);
  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const { addressLine1, addressLine3, postalCode } = clinic?.siteAddress || {};

  const healthCareWorkerAddress = useMemo(
    () =>
      `${addressLine1 && addressLine1 + ', '}${
        addressLine3 && addressLine3 + ', '
      }${postalCode}`,
    [addressLine1, addressLine3, postalCode]
  );

  const call = (phoneNumber?: string) => {
    if (!phoneNumber) {
      return showMessage({
        message: 'Phone number is not available',
        type: 'error',
      });
    }

    window.open(`tel:${phoneNumber}`);
  };

  const whatsapp = (number?: string) => {
    if (!number) {
      return showMessage({
        message: 'WhatsApp number is not available',
        type: 'error',
      });
    }

    window.open(`https://wa.me/${number}`);
  };

  if (!clinic && !isLoadingClinic) {
    return <NoCommunityFound />;
  }

  return (
    <BannerWrapper
      title="Your clinic"
      color={'primary'}
      size="small"
      renderOverflow
      renderBorder
      onBack={() => setClinicDetails(false)}
      displayOffline={!isOnline}
      className="flex flex-col p-4 pt-6"
      isLoading={isLoadingClinic}
    >
      <Typography text={clinic?.name} type="h1" color="textDark" />
      {!!clinic?.siteAddress && (
        <>
          <Typography
            text={`Clinic address:`}
            type="h3"
            color="textDark"
            className={'mt-4'}
          />
          <Typography
            text={healthCareWorkerAddress}
            type="body"
            color="textMid"
          />
          <Button
            size="small"
            shape="normal"
            color="primary"
            type="outlined"
            className="mt-3"
            text="Copy address"
            icon="DocumentDuplicateIcon"
            textColor="primary"
            onClick={() => {
              navigator.clipboard.writeText(healthCareWorkerAddress);
            }}
          />
        </>
      )}
      <Typography
        text="Clinic phone number:"
        type="h3"
        color="textDark"
        className={'mt-4'}
      />
      <Typography
        text={formatPhoneNumber(clinic?.phoneNumber ?? '0000000000')}
        type="body"
        color="secondary"
      />
      <Button
        size="small"
        shape="normal"
        color="primary"
        type="outlined"
        className="mt-3"
        text="Call clinic"
        textColor="primary"
        icon="PhoneIcon"
        onClick={() => call(clinic?.phoneNumber)}
      />
      <Divider className="my-8" dividerType="dashed" />
      {clinic?.teamLeads?.map((teamLeader) => (
        <Fragment key={teamLeader.id}>
          <Typography
            text={`${teamLeader?.firstName ?? ''} ${teamLeader?.surname ?? ''}`}
            type="h1"
            color="textDark"
          />
          <Typography
            text={`${clinic?.name ?? ''} ${
              teamLeader?.jobTitle ?? 'Team Leader'
            }`}
            type="h3"
            color="textMid"
            className={''}
          />
          <Typography
            text={`${teamLeader?.firstName ?? 'Team Leader'}'s phone number:`}
            type="h3"
            color="textDark"
            className="mt-4"
          />
          <Typography
            text={formatPhoneNumber(
              teamLeader?.phoneNumber ||
                teamLeader?.whatsAppNumber ||
                '0000000000'
            )}
            type="h2"
            color="secondary"
            className={'mb-4'}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary"
              type="outlined"
              size="small"
              onClick={() => whatsapp(teamLeader?.whatsAppNumber)}
            >
              <div className="flex items-center justify-center">
                <img src={WhatsLogo} alt="whatsapp" className="mr-2" />
                <Typography
                  text={`Whatsapp ${teamLeader?.firstName ?? ''}`}
                  type="button"
                  weight="skinny"
                  color="primary"
                />
              </div>
            </Button>
            <Button
              color={'primary'}
              type={'outlined'}
              size="small"
              text={`Call ${teamLeader?.firstName ?? ''}`}
              textColor="primary"
              icon="PhoneIcon"
              onClick={() => call(teamLeader?.phoneNumber)}
            />
          </div>
        </Fragment>
      ))}
      <Alert
        className={!!clinic?.teamLeads?.length ? 'mt-8' : ''}
        type="info"
        title="You can see & update the information you share with your team in the Community section."
        button={
          <Button
            color="primary"
            type="filled"
            size="small"
            text="Edit my team profile"
            icon="PencilIcon"
            textColor="white"
            onClick={() =>
              history.push(
                ROUTES.COMMUNITY.TEAM.MEMBERS.MEMBER_PROFILE.replace(
                  ':memberHealthCareWorkerId',
                  healthCareWorker?.id!
                ),
                { isFromAboutPage: true } as MemberProfileRouteState
              )
            }
          />
        }
      />
    </BannerWrapper>
  );
};
