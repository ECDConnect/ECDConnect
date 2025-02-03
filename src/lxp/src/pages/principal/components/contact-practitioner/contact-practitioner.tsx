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
import { ClassroomGroupDto, PractitionerDto } from '@ecdlink/core';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './contact-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './contact-practitioner.styles';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import TransparentLayer from '@/assets/TransparentLayer.png';

export const ContactPractitioner: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const location = useLocation<PractitionerProfileRouteState>();
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const practitionerId = location.state.practitionerId;
  const dialog = useDialog();
  const [practitioner, setPractitioner] = useState<PractitionerDto>();

  const getPractitionerDetails = async () => {
    if (userAuth && practitionerId) {
      setPractitioner(
        await new PractitionerService(
          userAuth?.auth_token ?? ''
        ).getPractitionerByUserId(practitionerId)
      );
    }
  };

  useEffect(() => {
    if (currentPractitioner?.isPrincipal !== true) {
      getPractitionerDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroupDto[]>();

  const classroomsDetailsForPractitioner = useCallback(
    async (practitionerUserId: string) => {
      const classroomDetails = (await new ClassroomGroupService(
        userAuth?.auth_token!
      ).getClassroomGroupsForUser(practitionerUserId)) as unknown;
      setPractitionerClassroomDetails(classroomDetails as ClassroomGroupDto[]);
      return classroomDetails;
    },
    [userAuth?.auth_token]
  );

  useMemo(() => {
    if (practitioner !== undefined) {
      classroomsDetailsForPractitioner(practitioner?.userId!);
    }
  }, [classroomsDetailsForPractitioner, practitioner]);

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

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={
          practitioner
            ? practitioner.user?.firstName || practitioner.user?.userName
            : ''
        }
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
            dataUrl={practitioner?.user?.profileImageUrl!}
            size={'header'}
            onPressed={() => {}}
            hasConsent={true}
          />
        </div>
        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={practitioner?.isPrincipal ? 'Principal' : 'Practitioner'}
            textColour={'white'}
            className={'mr-2'}
          />
          {practitionerClassroomDetails &&
            practitionerClassroomDetails?.map((item: any) => (
              <StatusChip
                key={item.id}
                backgroundColour="tertiary"
                borderColour="tertiary"
                text={`${item.name}`}
                textColour={'white'}
                className={'mr-2'}
              />
            ))}
        </div>
        <div>
          <Typography
            text={`Contact ${practitioner?.user?.firstName}`}
            type="h3"
            color="textDark"
            className={'mt-6 mb-1'}
          />
          <Typography
            text={`${practitioner?.user?.phoneNumber}`}
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
            >
              <div className="flex items-center justify-center">
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
                <Typography
                  text={`WhatsApp ${practitioner?.user?.firstName}`}
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
            >
              <div className="flex items-center justify-center">
                <PhoneIcon
                  className="text-secondary mr-2 h-5 w-4"
                  aria-hidden="true"
                />
                <Typography
                  text={`Call ${practitioner?.user?.firstName}`}
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
