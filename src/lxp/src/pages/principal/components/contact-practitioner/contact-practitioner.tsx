import { useHistory, useLocation } from 'react-router';
import {
  BannerWrapper,
  Button,
  Typography,
  Alert,
  DialogPosition,
  ProfileAvatar,
  StatusChip,
} from '@ecdlink/ui';
import { PractitionerDto, useDialog } from '@ecdlink/core';
import { PractitionerColleagues } from '@ecdlink/graphql';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './contact-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './contact-practitioner.styles';
import ROUTES from '@routes/routes';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { useSelector } from 'react-redux';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { useCallback, useEffect, useState } from 'react';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import TransparentLayer from '@/assets/TransparentLayer.png';
import WhatsAppIcon from '@/assets/logos/whatsapp';
import { useAppDispatch } from '@/store';

/** Contact-card fields only — enough for call / WhatsApp, no full practitioner profile. */
type ContactPerson = {
  userId?: string;
  firstName: string;
  displayName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  title: string;
  classroomNames: string[];
};

const firstNameFrom = (fullName?: string | null): string => {
  if (!fullName?.trim()) return '';
  return fullName.trim().split(/\s+/)[0] || fullName;
};

const mapColleagueToContact = (
  colleague: PractitionerColleagues
): ContactPerson => {
  const displayName =
    colleague.name?.trim() ||
    colleague.nickName?.trim() ||
    colleague.contactNumber ||
    '';
  const classroomNames = colleague.classroomNames
    ? colleague.classroomNames
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
    : [];

  return {
    userId: colleague.userId || undefined,
    firstName: firstNameFrom(displayName),
    displayName,
    phoneNumber: colleague.contactNumber || undefined,
    profileImageUrl: colleague.profilePhoto || undefined,
    title: colleague.title?.toLowerCase().includes('principal')
      ? 'Principal'
      : 'Practitioner',
    classroomNames,
  };
};

const mapPractitionerDtoToContact = (
  practitioner: PractitionerDto
): ContactPerson => {
  const displayName =
    practitioner.user?.fullName?.trim() ||
    [practitioner.user?.firstName, practitioner.user?.surname]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    practitioner.user?.userName ||
    '';

  return {
    userId: practitioner.userId || practitioner.user?.id || undefined,
    firstName:
      practitioner.user?.firstName ||
      firstNameFrom(displayName) ||
      practitioner.user?.userName ||
      '',
    displayName,
    phoneNumber: practitioner.user?.phoneNumber || undefined,
    profileImageUrl: practitioner.user?.profileImageUrl || undefined,
    title: practitioner.isPrincipal ? 'Principal' : 'Practitioner',
    classroomNames: [],
  };
};

export const ContactPractitioner: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const dialog = useDialog();

  const currentUser = useSelector(userSelectors.getUser);
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const practitionerId = location.state?.practitionerId;
  const isCurrentUserPrincipal = currentPractitioner?.isPrincipal === true;

  const [contact, setContact] = useState<ContactPerson>();
  const [isLoading, setIsLoading] = useState(false);

  const showOnlineOnly = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  }, [dialog]);

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
    }
  }, [isOnline, showOnlineOnly]);

  const loadContact = useCallback(async () => {
    if (!practitionerId) {
      return;
    }

    setIsLoading(true);
    try {
      // Prefer colleagues: authorized for practitioner → principal (leave notification)
      // and same-site contact cards. Call with the logged-in user's id.
      const callerUserId = currentUser?.id;
      if (callerUserId) {
        try {
          const colleagues = await appDispatch(
            practitionerThunkActions.getPractitionerColleagues({
              userId: callerUserId,
            })
          ).unwrap();

          let match = colleagues?.find(
            (colleague) => colleague?.userId === practitionerId
          );

          // Leave notification targets the principal; fall back by title if needed
          if (!match && !isCurrentUserPrincipal) {
            match = colleagues?.find((colleague) =>
              colleague?.title?.toLowerCase().includes('principal')
            );
          }

          if (match) {
            setContact(mapColleagueToContact(match));
            return;
          }
        } catch {
          // Fall through to principal/downward lookup when colleagues fails
        }
      }

      // Principal downward hierarchy: store first, then full practitioner by user id
      const fromStore = practitioners?.find(
        (item) => item.userId === practitionerId
      );
      if (fromStore) {
        setContact(mapPractitionerDtoToContact(fromStore));
        return;
      }

      // Only principals may call GetPractitionerByUserId for another user
      // (practitioners cannot look "up" to their principal via that API).
      if (isCurrentUserPrincipal) {
        const practitioner = await appDispatch(
          practitionerThunkActions.getPractitionerByUserId({
            userId: practitionerId,
            overrideCache: true,
          })
        ).unwrap();

        if (practitioner) {
          setContact(mapPractitionerDtoToContact(practitioner));
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    appDispatch,
    currentUser?.id,
    isCurrentUserPrincipal,
    practitionerId,
    practitioners,
  ]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const call = () => {
    if (!contact?.phoneNumber) return;
    window.open(`tel:${contact.phoneNumber}`);
  };

  const whatsapp = () => {
    if (!contact?.phoneNumber) return;
    window.open(
      `https://wa.me/${formatPhonenumberInternational(contact.phoneNumber)}`
    );
  };

  const contactFirstName = contact?.firstName || contact?.displayName || '';

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={contact?.displayName || (isLoading ? 'Loading...' : '')}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => history.push(ROUTES.DASHBOARD)}
        displayOffline={!isOnline}
        backgroundImageColour={'primary'}
        showBackground={true}
        backgroundUrl={TransparentLayer}
        className="px-4"
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            canChangeImage={false}
            dataUrl={contact?.profileImageUrl!}
            size={'header'}
            onPressed={() => {}}
            hasConsent={true}
          />
        </div>
        <div className={styles.chipsWrapper}>
          {contact && (
            <StatusChip
              backgroundColour={
                contact.title === 'Principal' ? 'primary' : 'successMain'
              }
              borderColour={
                contact.title === 'Principal' ? 'primary' : 'successMain'
              }
              text={contact.title}
              textColour={'white'}
              className={'mr-2'}
            />
          )}
          {contact?.classroomNames?.map((className) => (
            <StatusChip
              key={className}
              backgroundColour="tertiary"
              borderColour="tertiary"
              text={className}
              textColour={'white'}
              className={'mr-2'}
            />
          ))}
        </div>
        <div>
          <Typography
            text={contactFirstName ? `Contact ${contactFirstName}` : 'Contact'}
            type="h3"
            color="textDark"
            className={'mt-6 mb-1'}
          />
          <Typography
            text={contact?.phoneNumber || (isLoading ? '…' : '')}
            type="body"
            weight="skinny"
            color="quatenary"
          />
          <div className="mt-4 flex flex-wrap gap-4">
            <Button
              color={'secondary'}
              type={'outlined'}
              onClick={whatsapp}
              size="small"
              disabled={!contact?.phoneNumber}
            >
              <div className="flex items-center justify-center">
                <WhatsAppIcon className={styles.buttonIconStyle} />
                <Typography
                  text={
                    contactFirstName
                      ? `WhatsApp ${contactFirstName}`
                      : 'WhatsApp'
                  }
                  type="button"
                  weight="skinny"
                  color="secondary"
                />
              </div>
            </Button>
            <Button
              color={'secondary'}
              type={'outlined'}
              onClick={call}
              size="small"
              disabled={!contact?.phoneNumber}
            >
              <div className="flex items-center justify-center">
                <PhoneIcon
                  className="text-secondary mr-2 h-5 w-4"
                  aria-hidden="true"
                />
                <Typography
                  text={contactFirstName ? `Call ${contactFirstName}` : 'Call'}
                  type="button"
                  weight="skinny"
                  color="secondary"
                />
              </div>
            </Button>
          </div>

          <Alert
            type="info"
            className="mt-4"
            message="WhatsApps and phone calls will be charged at your standard carrier rates."
          />
        </div>
      </BannerWrapper>
    </div>
  );
};
