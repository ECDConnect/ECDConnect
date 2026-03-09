import { useState, useEffect } from 'react';
import {
  StackedList,
  UserAlertListDataItem,
  Card,
  Typography,
  renderIcon,
  Button,
  LoadingSpinner,
  RoundIcon,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import { getAvatarColor, useDialog } from '@ecdlink/core';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioners-list.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { PractitionerDto } from '@/../../../packages/core/lib';
import { useAppDispatch } from '@store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { PractitionerActions } from '@/store/practitioner/practitioner.actions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { InviteDto } from '@ecdlink/core/src/models/dto/Invite/invite.dto';
import { InviteService } from '@/services/InviteService';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@/store/user';
import { InvitedPractitioner } from '@/pages/practitioner/practitioner-programme-information/practitioner-list/invited-practitioner/invited-practitioner';
import { formatPhonenumberLocal } from '@utils/common/contact-details.utils';
import { useTenant } from '@/hooks/useTenant';

export const PractitionersList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const isTrialPeriod = useIsTrialPeriod();
  const history = useHistory();
  const dialog = useDialog();
  const { errorDialog } = useRequestResponseDialog();
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const [invites, setInvites] = useState<InviteDto[]>([]);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [selectedInvite, setSelectedInvite] = useState<InviteDto>();
  const [practitionerInviteModal, setPractitionerInviteModal] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;

  const { isLoading, isRejected: isGetPractitionerRejected } =
    useThunkFetchCall(
      'practitioner',
      PractitionerActions.GET_ALL_PRACTITIONERS
    );

  useEffect(() => {
    if (isGetPractitionerRejected) {
      errorDialog();
    }
  }, [errorDialog, isGetPractitionerRejected]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [practitionerListData, setPractitionerListData] =
    useState<UserAlertListDataItem[]>();

  const [practitionersMessages, setPractitionersMessages] = useState<any[]>();

  const handleClick = (practitionerId: string) => {
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
      practitionerId,
    });
  };

  const handleInvitedPractitioner = (id?: string) => {
    const selectedInvite = invites?.find((item) => item?.id === id);
    setSelectedInvite(selectedInvite);
    setPractitionerInviteModal(true);
  };

  const getPractitionerColleagues = async () => {
    if (userAuth && isOnline) {
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
      if (isOpenAccess) {
        setInvites(
          await new InviteService(userAuth?.auth_token).getInvitesByPrincipalId(
            user?.id!
          )
        );
      }
    }
  };

  useEffect(() => {
    getPractitionerColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const hasPractitioners =
      (!!practitionersList?.length && !!practitionersMessages?.length) ||
      !!invites?.length;
    if (hasPractitioners) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const invite of invites) {
        practitionerListItem.push({
          id: invite.id,
          profileDataUrl: '',
          title: `${formatPhonenumberLocal(invite.user?.phoneNumber!!)}`,
          subTitle: `Not on ECD Connect`,
          profileText: `${formatPhonenumberLocal(invite.user?.phoneNumber!!)}`,
          alertSeverity: 'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => handleInvitedPractitioner(invite.id || ''),
        });
      }

      if (practitionersList?.length) {
        for (const practitioner of practitionersList) {
          practitionerListItem.push(mapUserListDataItem(practitioner));
        }
      }
      setPractitionerListData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersList?.length, practitionersMessages, invites]);

  const classroomsDetailsForPractitioner = async () => {
    if (isOnline) {
      const practitionersMessageData = await appDispatch(
        practitionerThunkActions.getPractitionerDisplayMetrics({})
      ).unwrap();

      setPractitionersMessages(practitionersMessageData);
      return practitionersMessageData;
    }
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showTrialPeriodCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return (
          <JoinOrAddPreschoolModal
            onSubmit={onSubmit}
            isTrialPeriod={!!isTrialPeriod}
          />
        );
      },
    });
  };

  const mapUserListDataItem = (
    practitionerRecord: PractitionerDto
  ): UserAlertListDataItem => {
    const practitioner = practitionersList?.find(
      (x) => x.userId === practitionerRecord.userId
    );

    const currentPractitionerMessage = practitionersMessages?.find((item) => {
      return item?.userId === practitionerRecord?.userId;
    });

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl!,
      title: practitioner?.user?.firstName
        ? `${practitioner?.user?.firstName} ${
            !!practitioner?.user?.surname ? ` ${practitioner.user.surname}` : ''
          }`
        : `${practitioner?.user?.userName}`,
      ...(isOnline && !!currentPractitionerMessage?.subject
        ? { subTitle: `${currentPractitionerMessage?.subject}` }
        : {}),
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      alertSeverity: !isOnline
        ? 'none'
        : currentPractitionerMessage?.color === 'Success'
        ? 'success'
        : currentPractitionerMessage?.color === 'Warning'
        ? 'warning'
        : 'error',
      avatarColor: getAvatarColor() || '',
      onActionClick: () => handleClick(practitioner?.userId!),
    };
  };

  const handleReassignClass = () => {
    if (!isOnline) {
      return dialog({
        blocking: false,
        position: DialogPosition.Middle,
        render: (onClose) => {
          return <OnlineOnlyModal onSubmit={onClose} />;
        },
      });
    }

    history.push('principal/practitioner-reassign-class');
  };

  const offlineDialog = () => {
    if (!isOnline) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        blocking: true,
        render: (onSubmit) => {
          return <OnlineOnlyModal onSubmit={onSubmit} />;
        },
      });
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size={'medium'}
        spinnerColor={'quatenary'}
        backgroundColor={'uiBg'}
      />
    );
  }

  if (!practitionerListData || !practitionerListData.length) {
    return (
      <div className="pt-50 flex w-full flex-col items-center justify-center gap-4 p-12">
        <RoundIcon
          backgroundColor="alertMain"
          icon="PresentationChartBarIcon"
          iconColor="white"
          size={{ h: '12', w: '12' }}
        />
        <Typography
          type="h1"
          color="textDark"
          text={"You don't have any staff yet!"}
          className={'text-center'}
        />
        <Button
          type="filled"
          color="quatenary"
          className={'mb-6 w-full'}
          onClick={() => {
            if (!isOnline) {
              offlineDialog();
            } else if (isTrialPeriod) {
              showTrialPeriodCompleteProfileBlockingDialog();
            } else {
              history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST);
            }
          }}
        >
          {renderIcon('PlusCircleIcon', 'w-5 h-5 color-white text-white mr-2')}
          <Typography
            type="body"
            className="mr-4"
            color="white"
            text={'Add a practitioner'}
          />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center">
        <div className="w-11/12">
          <StackedList
            className={styles.stackedList}
            listItems={practitionerListData ? practitionerListData : []}
            type={'UserAlertList'}
          />
        </div>
        <Card className={styles.absentCard}>
          <div className={styles.absentCardTitle}>
            <Typography
              type={'h1'}
              color="textDark"
              text={'Practitioner time off'}
              className={styles.absentCardTitle}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={
                'Keep track of practitioner absenteeism and leave, and record your own leave.'
              }
              className={styles.absentCardSubTitle}
            />
            <div className="flex justify-center">
              <Button
                type="filled"
                color="quatenary"
                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                onClick={handleReassignClass}
              >
                {renderIcon(
                  'PencilAltIcon',
                  'w-5 h-5 color-white text-white mr-1'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={'Record absence/leave'}
                />
              </Button>
            </div>
          </div>
        </Card>
        <div className="flex w-11/12 justify-center">
          <Button
            type="outlined"
            color="quatenary"
            className={'mt-6 mb-6 w-full'}
            onClick={() => history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST)}
          >
            {renderIcon(
              'UsersIcon',
              'w-5 h-5 color-quatenary text-quatenary mr-2'
            )}
            <Typography
              type="body"
              className="mr-4"
              color="quatenary"
              text={'Add or remove practitioners'}
            />
          </Button>
        </div>
      </div>
      <Dialog
        fullScreen
        visible={practitionerInviteModal}
        position={DialogPosition.Top}
      >
        <InvitedPractitioner
          setPractitionerInviteModal={setPractitionerInviteModal}
          userId={selectedInvite?.user.id || ''}
          phoneNumber={selectedInvite?.user.phoneNumber || ''}
          dateInvited={selectedInvite?.insertedDate}
          setInvites={setInvites}
        />
      </Dialog>
    </>
  );
};

export default PractitionersList;
