import {
  BannerWrapper,
  Button,
  Alert,
  DialogPosition,
  ActionModal,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { InvitedPractitionerRouteState } from './invited-practitioner.types';
import { addDays, differenceInMinutes, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '@/pages/business/business.types';
import { useHistory } from 'react-router';
import { copyToClip } from '@utils/common/clipboard.utils';
import { useTenant } from '@/hooks/useTenant';
import { formatPhonenumberLocal } from '@utils/common/contact-details.utils';
import { invitesThunkActions } from '@/store/invites';

export const InvitedPractitioner: React.FC<InvitedPractitionerRouteState> = ({
  setPractitionerInviteModal,
  userId,
  phoneNumber,
  dateInvited,
  setInvites,
}) => {
  const { isOnline } = useOnlineStatus();
  const [showAlert, setShowAlert] = useState(false);
  const [inviteDates, setInviteDates] = useState<Date[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [timeSinceLastInvite, setTimeSinceLastInvite] = useState<number>(1000);
  const [isSending, setIsSending] = useState(false);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const history = useHistory();
  const tenant = useTenant();

  const getTimeSinceLastInvite = (invite: Date) => {
    return Math.abs(differenceInMinutes(new Date(invite as Date), new Date()));
  };

  const getInviteDetails = async () => {
    setIsLoading(true);
    if (!!userId) {
      const dates = await appDispatch(
        practitionerThunkActions.getAllPractitionerInvites({ userId: userId })
      ).unwrap();
      dates.sort();

      if (!!dates.length) {
        setTimeSinceLastInvite(
          getTimeSinceLastInvite(dates[dates?.length - 1])
        );
      }
      setInviteDates(dates);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getInviteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const sendPractitionerInvite = async () => {
    if (isOnline) {
      if (
        (!inviteDates || !inviteDates.length || timeSinceLastInvite > 60) &&
        userId!!
      ) {
        setShowAlert(true);
        setIsSending(true);
        await appDispatch(
          practitionerThunkActions.sendPractitionerInviteToApplication({
            userId: userId,
          })
        );
        await getInviteDetails();
        setShowAlert(false);
      }
    } else {
      showOnlineOnly();
    }
  };

  const removePractitioner = async () => {
    await appDispatch(
      practitionerThunkActions.updatePrincipalInvitation({
        userId: userId!,
        principalHierarchy: practitioner?.id!,
        accepted: false,
      })
    );
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();

    setInvites(
      await appDispatch(
        invitesThunkActions.getInvitesByPrincipalId({})
      ).unwrap()
    );

    showMessage({
      message: `${formatPhonenumberLocal(phoneNumber!!)} removed`,
    });
  };

  const createLink = async () => {
    setIsLoading(true);

    const linkCopied = await copyToClip(
      `${practitioner?.user?.firstName} practitioner has invited you to register. Tap this link to register: ${tenant?.tenant?.siteAddress}`
    );

    const whatsapp = () => {
      const textMessage = `${practitioner?.user?.firstName} practitioner has invited you to register. Tap this link to register: ${tenant?.tenant?.siteAddress}`;
      const whatsAppLink = `whatsapp://send?text=${textMessage}`;
      window.open(whatsAppLink);
    };

    setIsLoading(false);
    dialog({
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            icon={linkCopied ? 'CheckCircleIcon' : 'InformationCircleIcon'}
            iconBorderColor={linkCopied ? 'successBg' : 'alertBg'}
            iconColor={linkCopied ? 'successMain' : 'infoMain'}
            title={linkCopied ? 'Link Copied!' : 'Please Copy Link'}
            detailText={`Go to WhatsApp or your phone's Messages app to paste the link.`}
            actionButtons={[
              {
                colour: 'quatenary',
                text: 'Go to WhatsApp',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'ArrowCircleRightIcon',
                onClick: () => {
                  whatsapp();
                },
              },
              {
                colour: 'quatenary',
                text: 'Close',
                textColour: 'quatenary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: () => {
                  onCancel();
                },
              },
            ]}
          ></ActionModal>
        );
      },
      position: DialogPosition.Middle,
    });
  };

  return (
    <BannerWrapper
      title={`Invited Practitioner`}
      color={'primary'}
      size="medium"
      renderOverflow={false}
      onBack={() => setPractitionerInviteModal(false)}
      displayOffline={!isOnline}
      renderBorder={true}
      className="w-full justify-center p-2"
    >
      <div className="p-4">
        <Alert
          className="mt-4 w-full rounded-xl"
          type={'error'}
          title={`This practitioner (${formatPhonenumberLocal(
            phoneNumber!!
          )}) has not registered on ECD Connect. If they do not register by ${format(
            addDays(new Date(dateInvited!), 7),
            'LLL d'
          )}, this profile will be deleted.`}
          list={[
            `If the practitioner did not get the SMS, tap below to copy the link.`,
          ]}
          button={
            <Button
              text="Copy ECD Connect link"
              icon="LinkIcon"
              type={'filled'}
              color={'quatenary'}
              textColor={'white'}
              onClick={createLink}
            />
          }
        />
      </div>
      {!!inviteDates && !!inviteDates.length && (
        <>
          <div className="flex w-full justify-center">
            <Typography
              type="h2"
              color={inviteDates.length >= 3 ? 'errorMain' : 'textDark'}
              text={`${inviteDates.length} out of 5 invitations sent:`}
              className="mt-4 w-11/12"
            />
          </div>
          {inviteDates?.map((invite, index) => (
            <div className="mt-2 flex w-full justify-center">
              <Typography
                type="body"
                color={'textMid'}
                className="w-11/12"
                text={`• You sent an invitation on ${format(
                  new Date(invite as Date),
                  'LLLL d yyyy'
                )}`}
              />
            </div>
          ))}
          {inviteDates.length === 4 && (
            <div className="my-4 flex justify-center">
              <Alert
                type="info"
                title="You can send 1 more invitation."
                className="w-11/12"
              />
            </div>
          )}
          {inviteDates.length >= 5 && (
            <div className="my-4 flex justify-center">
              <Alert
                type="info"
                title="You've reached your invite limit. Copy the link above to share it with the practitioner."
                className="w-11/12"
              />
            </div>
          )}
          {timeSinceLastInvite < 60 && inviteDates.length < 5 && (
            <div className="my-4 flex justify-center">
              <Alert
                type="info"
                title="You need to wait 1 hour before re-sending the invitation again."
                className="w-11/12"
              />
            </div>
          )}
        </>
      )}

      <div className="p-4">
        <div className="flex w-full justify-center">
          <Button
            disabled={
              isLoading ||
              (!!inviteDates &&
                (inviteDates.length >= 5 || timeSinceLastInvite < 60))
            }
            text="Re-send invitation"
            icon="PaperAirplaneIcon"
            type={'filled'}
            color={'quatenary'}
            textColor={'white'}
            className="w-full shadow-xl"
            onClick={sendPractitionerInvite}
          />
        </div>
        <div className="flex w-full justify-center">
          <Button
            size="normal"
            className="mt-4 mb-4 w-full"
            type="outlined"
            color="quatenary"
            text="Remove practitioner"
            textColor="quatenary"
            icon="TrashIcon"
            onClick={() => {
              if (isOnline) {
                removePractitioner();
                setPractitionerInviteModal(false);
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.STAFF,
                });
              } else {
                showOnlineOnly();
              }
            }}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
