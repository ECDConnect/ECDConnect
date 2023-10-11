import { useState, useEffect } from 'react';
import {
  StackedList,
  UserAlertListDataItem,
  Card,
  Typography,
  renderIcon,
  Button,
  LoadingSpinner,
  DialogPosition,
  ActionModal,
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
import { EmptyPractitioners } from './components/empty-practitioners/empty-practitioners';
import { PractitionerDto } from '@/../../../packages/core/lib';
import { useAppDispatch } from '@store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';

export const PractitionersList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const { errorDialog } = useRequestResponseDialog();
  const { isOnline } = useOnlineStatus();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );

  const { isRejected: isGetPractitionerRejected } = useThunkFetchCall(
    'practitioner',
    'getAllPractitioners'
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
  const [loading, setLoading] = useState(false);

  const handleClick = (practitionerId: string) => {
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
      practitionerId,
    });
  };

  useEffect(() => {
    if (isOnline) {
      (async () =>
        await appDispatch(
          practitionerThunkActions.getAllPractitioners({})
        ).unwrap())();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  useEffect(() => {
    if (
      (isOnline &&
        !!practitionersList?.length &&
        !!practitionersMessages?.length) ||
      (!isOnline && !!practitionersList?.length)
    ) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setPractitionerListData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersList?.length, practitionersMessages]);

  const classroomsDetailsForPractitioner = async () => {
    if (isOnline) {
      setLoading(true);
      const practitionersMessageData = await appDispatch(
        practitionerThunkActions.getPractitionerDisplayMetrics({})
      ).unwrap();

      setPractitionersMessages(practitionersMessageData);
      setLoading(false);
      return practitionersMessageData;
    }
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
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
    history.push('principal/practitioner-reassign-class');
  };

  const handleAddPractitionerOrReassignClass = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          importantText={`What would you like to change?`}
          icon={'QuestionMarkCircleIcon'}
          iconColor={'infoDark'}
          iconBorderColor={'infoBb'}
          iconClassName="h-14 w-14"
          actionButtons={[
            {
              text: 'Add or remove practitioners',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST);
                // onClose();
              },
              leadingIcon: 'UsersIcon',
            },
            {
              text: 'Change classes or move children',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
                onCancel();
                history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, {
                  a: 'hello',
                });
              },
              leadingIcon: 'ViewGridAddIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <>
      {practitionersList?.length! > 0 || practitionersList !== undefined ? (
        <div className="flex flex-wrap justify-center">
          {loading && isOnline ? (
            <LoadingSpinner
              className="mt-6"
              size={'medium'}
              spinnerColor={'primary'}
              backgroundColor={'uiLight'}
            />
          ) : (
            <>
              <div className="w-11/12">
                <StackedList
                  className={styles.stackedList}
                  listItems={practitionerListData ? practitionerListData : []}
                  type={'UserAlertList'}
                ></StackedList>
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
                      color="primary"
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
                      ></Typography>
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="flex w-11/12 justify-center">
                <Button
                  type="outlined"
                  color="primary"
                  className={'mt-6 mb-6 w-full'}
                  onClick={handleAddPractitionerOrReassignClass}
                >
                  {renderIcon(
                    'ViewGridAddIcon',
                    'w-5 h-5 color-primary text-primary mr-2'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="primary"
                    text={'Manage classes and practitioners'}
                  ></Typography>
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <EmptyPractitioners />
      )}
    </>
  );
};

export default PractitionersList;
