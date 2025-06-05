import {
  Alert,
  Button,
  Typography,
  ActionModal,
  Dialog,
  DialogPosition,
  LoadingSpinner,
} from '@ecdlink/ui';
import { CalendarIcon } from '@heroicons/react/solid';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  GetAllWards,
  GetUserCountForMessageCriteria,
  SaveBulkMessagesForAdmin,
} from '@ecdlink/graphql';
import {
  AuthUser,
  LocalStorageKeys,
  MessageLogDto,
  NOTIFICATION,
  WardDto,
  useNotifications,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { XIcon } from '@heroicons/react/solid';
import MessageForm from './message-form';
import { useHistory } from 'react-router';
import { MessageRoleDto, ssRoles } from './message';
import { useTenant } from '../../../hooks/useTenant';

export default function MessagePanel() {
  const messageSchema = Yup.object().shape({
    subject: Yup.string()
      .required('Message title is required')
      .max(50, 'Message title too long'),
    message: Yup.string()
      .required('Message text is required')
      .max(160, 'Message text too long'),
    messageDate: Yup.date().required('Message date is required'),
    messageTime: Yup.string().required('Message time is required'),
    roleIds: Yup.array()
      .min(1, 'Choose at least 1 role')
      .required('Roles are required'),
    provinceId: Yup.string(),
    wardName: Yup.string(),
  });

  const roleIds: string[] = [];
  const messageLogIds: string[] = [];
  const initialMessageValues: MessageLogDto = {
    subject: '',
    message: '',
    messageDate: undefined,
    messageTime: '',
    toGroups: '',
    provinceId: '',
    wardName: '',
    districtId: '',
    sendByUserId: '',
    roleIds: roleIds,
    roleNames: '',
    isEdit: false,
    messageLogIds: messageLogIds,
  };

  // FORMS
  const {
    register: messageRegister,
    formState: messageFormState,
    getValues: messageGetValues,
    setValue: messageSetValue,
  } = useForm({
    resolver: yupResolver(messageSchema),
    defaultValues: initialMessageValues,
    mode: 'onBlur',
  });

  const {
    errors: messageFormErrors,
    isValid: isMessageValid,
    isDirty,
  } = messageFormState;

  const history = useHistory();
  const user = localStorage.getItem(LocalStorageKeys.user);
  const message = localStorage.getItem('selectedMessage');
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const [showSavingDialog, setShowSavingDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<MessageRoleDto[]>(ssRoles);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();
  const [currentMessage, setCurrentMessage] = useState<MessageLogDto>();
  const [wardData, setWardData] = useState<WardDto[]>([]);
  const [wardName, setWardName] = useState('');
  const [roleData, setRoleData] = useState<MessageRoleDto[]>([]);
  const { setNotification } = useNotifications();
  const tenant = useTenant();

  const { data: wards } = useQuery(GetAllWards, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
  }, [user]);

  // useEffect(() => {
  //   if (tenant.isCHWConnect) {
  //     setRoleData(ggRoles);
  //   } else {
  //     setRoleData(ssRoles);
  //   }
  // }, [tenant]);

  useEffect(() => {
    if (wards) {
      const copyItems = Object.assign([], wards.allWards);
      const newWard: WardDto = {
        provinceId: '',
        ward: 'Click to choose a district',
      };
      const unknown: WardDto = {
        provinceId: 'Unknown',
        ward: 'Unknown',
      };
      copyItems.unshift(newWard);
      copyItems.push(unknown);
      setWardData(copyItems);
      setWardName(copyItems[0].ward);
      messageSetValue('wardName', copyItems[0].ward);
    }
  }, [wards, messageSetValue]);

  useEffect(() => {
    if (currentMessage) {
      if (currentMessage.roleIds.length !== 0) {
        if (roleData) {
          const messageRoles: MessageRoleDto[] = [];
          currentMessage.roleIds.forEach((roleId) => {
            messageRoles.push(
              roleData.find((item) => item.id.indexOf(roleId) !== -1)
            );
          });
          setSelectedRoles(messageRoles);
          messageSetValue('roleIds', messageRoles.map(({ id }) => id) ?? [], {
            shouldValidate: true,
          });
        }
      }

      if (currentMessage.wardName !== '') {
        const wardIndex = wardData.findIndex((item) =>
          item.ward.indexOf(currentMessage.wardName)
        );
        setWardName(wardName);
        messageSetValue('wardName', wardIndex.toString(), {
          shouldValidate: true,
        });
      }

      if (currentMessage.messageDate != null) {
        setIsEdit(true);
        const messageDate = new Date(currentMessage.messageDate);
        const messageHours =
          (messageDate.getHours() < 10 ? '0' : '') + messageDate.getHours();
        const messageMinute =
          (messageDate.getMinutes() < 10 ? '0' : '') + messageDate.getMinutes();
        messageSetValue('messageTime', messageHours + ':' + messageMinute, {
          shouldValidate: true,
        });
        messageSetValue(
          'messageDate',
          new Date(currentMessage.messageDate) ?? undefined,
          {
            shouldValidate: false,
          }
        );
      }

      messageSetValue('provinceId', currentMessage.provinceId ?? '', {
        shouldValidate: true,
      });

      messageSetValue('districtId', currentMessage.districtId ?? '', {
        shouldValidate: true,
      });

      messageSetValue('subject', currentMessage.subject ?? '', {
        shouldValidate: true,
      });
      messageSetValue('message', currentMessage.message ?? '', {
        shouldValidate: true,
      });
    }
  }, [currentMessage, messageSetValue, wardData, wardName, roleData]);

  const [getUserCountForMessageCriteria, { data: totalUsers }] = useLazyQuery(
    GetUserCountForMessageCriteria,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        provinceId:
          messageGetValues('provinceId') === 'Unknown'
            ? ''
            : messageGetValues('provinceId'),
        districtId: messageGetValues('districtId'),
        wardName:
          wardName === 'Unknown' || wardName === 'Click to choose a district'
            ? ''
            : wardName,
        roleIds: selectedRoles.map(({ id }) => id),
      },
    }
  );

  useEffect(() => {
    if (totalUsers) {
      setUserCount(totalUsers.userCountForMessageCriteria);
      setIsLoading(false);
      setShowLoadingDialog(false);
      setShowSavingDialog(true);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (message !== 'null') {
      const parsedMessage = JSON.parse(message);
      const messageDate = new Date(parsedMessage.messageDate);
      setIsView(messageDate < new Date() ? true : false);
      setMessageStatus(messageDate < new Date() ? 'completed' : 'pending');
      setCurrentMessage(parsedMessage);
    }
  }, [message]);

  const [saveBulkMessagesForAdmin] = useMutation(SaveBulkMessagesForAdmin);
  const messageForm = messageGetValues();

  const onShowDialog = () => {
    setUserCount(0);
    setIsLoading(true);
    setShowLoadingDialog(true);
    getUserCountForMessageCriteria();
  };

  const onShowSavingDialog = () => {
    setShowSavingDialog(false);
    setIsLoading(true);
    setShowScheduleDialog(true);
    onSaveMessage();
  };

  const onSaveMessage = async () => {
    const formValues = messageGetValues();
    setIsLoading(true);

    let toGroups = '';
    if (formValues.districtId !== '') {
      toGroups += 'District:' + formValues.districtId + '|';
    }
    if (
      wardName !== '' &&
      wardName !== 'Click to choose a district' &&
      wardName !== 'Unknown'
    ) {
      toGroups += 'Ward:' + wardName + '|';
    }
    if (formValues.provinceId !== '' && formValues.provinceId !== 'Unknown') {
      toGroups += 'Province:' + formValues.provinceId + '|';
    }
    if (selectedRoles.length !== 0) {
      toGroups += 'Role:' + selectedRoles.map(({ id }) => id);
    }

    const messageDate = formValues.messageDate;
    const messageTimeItems = formValues.messageTime.split(':');
    const hour = messageTimeItems[0];
    const minute = messageTimeItems[1];

    const inputModel: MessageLogDto = {
      districtId: formValues.districtId,
      wardName:
        wardName === 'Unknown' || wardName === 'Click to choose a district'
          ? ''
          : wardName,
      provinceId:
        formValues.provinceId !== 'Unknown' ? formValues.provinceId : '',
      toGroups: toGroups,
      sendByUserId: authenticatedUser.id,
      message: formValues.message,
      messageDate: new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate(),
        +hour,
        +minute
      ),
      messageTime: formValues.messageTime,
      subject: formValues.subject,
      roleIds: selectedRoles.map(({ id }) => id),
      roleNames: '',
      isEdit: isEdit,
      messageLogIds: currentMessage && currentMessage.messageLogIds,
    };

    await saveBulkMessagesForAdmin({
      variables: {
        input: inputModel,
      },
    })
      .then((response) => {
        setShowScheduleDialog(false);
        setIsLoading(false);
        backToMessageList();
        setNotification({
          title: 'Message scheduled',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const panelSetRoles = async (roles: MessageRoleDto[]) => {
    setSelectedRoles(roles);
  };

  const panelSetDate = async (date: Date) => {
    messageSetValue('messageDate', date);
  };

  useEffect(() => {
    if (messageForm.wardName) {
      if (messageForm.wardName === 'Click to choose a district') {
        setWardName(wardData[0].ward);
      } else {
        if (messageForm.wardName !== '' && messageForm.wardName !== '-1') {
          const wardIndex = +messageGetValues('wardName');
          setWardName(wardData[wardIndex].ward);
        }
      }
    }
  }, [messageForm, messageGetValues, wardData]);

  const getIsValid = () => {
    return isMessageValid ? true : false;
  };

  const getFormattedDate = () => {
    if (messageGetValues('messageDate') !== undefined) {
      return (
        `Schedule message for ` +
        format(messageGetValues('messageDate'), 'dd MMMM') +
        ` at ` +
        messageGetValues('messageTime') +
        ` ?`
      );
    }

    return '';
  };

  const backToMessageList = () => {
    history.push({
      pathname: '/messaging/list-messages',
      state: {
        component: 'messaging',
      },
    });
  };

  const showDisgardPopup = () => {
    if (isDirty) {
      setDisplayFormIsDirty(true);
    } else {
      setDisplayFormIsDirty(false);
      backToMessageList();
    }
  };

  const getTitle = () => {
    if (currentMessage) {
      const messageDate = new Date(currentMessage.messageDate);

      return messageDate < new Date() ? 'View message' : 'Edit message';
    }
    return 'Send a message';
  };

  const getComponent = () => {
    return (
      <>
        <div>
          <div className="pb-2">
            <div className="flex">
              <Typography
                type={'h2'}
                color="textMid"
                weight="bold"
                text={getTitle()}
                className={'mt-4 mb-4 w-full'}
              />
              <div className="absolute top-20 right-20 ">
                <button
                  className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
                  onClick={() => showDisgardPopup()}
                >
                  <span className="sr-only">Close panel</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <hr className="border-b border-dashed border-gray-500 px-2" />
            {messageStatus === 'completed' ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You can view the sent message but you cannot edit.`}
                title={
                  `This message was last sent on ` + currentMessage.messageDate
                }
                type="warning"
              />
            ) : (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`Messages will only be sent to active users.`}
                type="info"
              />
            )}
          </div>

          <MessageForm
            formKey={`message-${new Date().getTime()}`}
            register={messageRegister}
            errors={messageFormErrors}
            messageSetValue={messageSetValue}
            panelSetRoles={panelSetRoles}
            panelSetDate={panelSetDate}
            editMessageDate={messageGetValues('messageDate')}
            editRoles={selectedRoles}
            wardData={wardData}
            isView={isView}
          />

          <Button
            className="mt-3 mr-6 w-full rounded"
            type="filled"
            color="secondary"
            onClick={onShowDialog}
            disabled={!getIsValid() || isView}
          >
            <CalendarIcon color="white" className="mr-6 h-6 w-6" />
            <Typography
              type="help"
              color="white"
              text="Schedule message"
            ></Typography>
          </Button>
        </div>
        <Dialog
          className="px-60"
          stretch
          visible={displayFormIsDirty}
          position={DialogPosition.Middle}
        >
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Discard unsaved changes?`}
            detailText={'If you leave now, you will lose all of your changes.'}
            actionButtons={[
              {
                text: 'Keep editing',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => setDisplayFormIsDirty(false),
                leadingIcon: 'PencilIcon',
              },
              {
                text: 'Discard changes',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => {
                  backToMessageList();
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        </Dialog>

        <Dialog
          className="px-60"
          stretch
          visible={showLoadingDialog}
          position={DialogPosition.Middle}
        >
          <LoadingSpinner
            size="medium"
            className="mt-4"
            spinnerColor="primary"
            backgroundColor="uiLight"
          />

          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Selecting recipients`}
            detailText={`Gathering recipient list. This might take a few minutes.`}
            actionButtons={[
              {
                text: 'Cancel',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => {
                  setShowLoadingDialog(false);
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        </Dialog>
        <Dialog
          className="px-60"
          stretch
          visible={showScheduleDialog}
          position={DialogPosition.Middle}
        >
          <LoadingSpinner
            size="medium"
            className="mt-4"
            spinnerColor="primary"
            backgroundColor="uiLight"
          />

          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Message scheduling in process`}
            detailText={`Your message is being scheduled. This may take a few minutes.`}
            actionButtons={[
              {
                text: 'Close',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => {
                  setShowScheduleDialog(false);
                  backToMessageList();
                  setNotification({
                    title: 'Message scheduled',
                    variant: NOTIFICATION.SUCCESS,
                  });
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        </Dialog>
        <Dialog
          className="px-60"
          stretch
          visible={showSavingDialog}
          position={DialogPosition.Middle}
        >
          {isLoading && (
            <LoadingSpinner
              size="medium"
              className="mt-4"
              spinnerColor="primary"
              backgroundColor="uiLight"
            />
          )}
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={getFormattedDate()}
            detailText={
              `This message will be sent to ` +
              userCount +
              ` people (` +
              selectedRoles.map((x) => {
                return x.label;
              }) +
              `).`
            }
            actionButtons={[
              {
                text: 'Yes schedule',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => onShowSavingDialog(),
                leadingIcon: 'PencilIcon',
              },
              {
                text: 'No cancel',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => {
                  setShowSavingDialog(false);
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        </Dialog>
      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
    </article>
  );
}
