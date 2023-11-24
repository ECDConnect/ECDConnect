import {
  Alert,
  Button,
  Typography,
  ActionModal,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { CalendarIcon } from '@heroicons/react/solid';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  FilterRoleList,
  GetAllWards,
  GetUserCountForMessageCriteria,
  SaveBulkMessagesForAdmin,
} from '@ecdlink/graphql';
import {
  AuthUser,
  LocalStorageKeys,
  MessageLogDto,
  RoleDto,
  WardDto,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { XIcon } from '@heroicons/react/solid';
import MessageForm from './message-form';
export interface PanelProps {
  message?: MessageLogDto;
  closeDialog: (value: boolean) => void;
  setFormIsDirty?: (value: boolean) => void;
  isView?: boolean;
  messageStatus?: string;
}

export default function MessagePanel(props: PanelProps) {
  const messageSchema = Yup.object().shape({
    subject: Yup.string()
      .required('Message title is required')
      .max(50, 'Message title too long'),
    message: Yup.string()
      .required('Message text is required')
      .max(160, 'Message text too long'),
    messageDate: Yup.date(), //.required('Message date is required'),
    messageTime: Yup.string(), //.required('Message time is required'),
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
    messageDate: new Date(),
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

  const user = localStorage.getItem(LocalStorageKeys.user);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const [showSavingDialog, setShowSavingDialog] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<RoleDto[]>([]);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();
  const [wardData, setWardData] = useState<WardDto[]>([]);
  const [wardName, setWardName] = useState('');
  const [currentMessage, setCurrentMessage] = useState(props.message);

  const { data: wards } = useQuery(GetAllWards, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: roles } = useQuery(FilterRoleList, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
    if (wards) {
      const copyItems = Object.assign([], wards.allWards);
      const newWard: WardDto = {
        provinceId: '',
        ward: 'Click to choose a district',
      };
      copyItems.unshift(newWard);
      setWardData(wards.allWards);
    }
    if (currentMessage) {
      if (currentMessage.roleIds.length != 0) {
        if (roles) {
          const availableRoles = Object.assign([], roles.roles);
          const messageRoles = [];

          currentMessage.roleIds.forEach((roleId) => {
            messageRoles.push(
              availableRoles.find((item) => item.id.indexOf(roleId) !== -1)
            );
          });
          setSelectedRoles(messageRoles);
          messageSetValue('roleIds', messageRoles.map(({ id }) => id) ?? [], {
            shouldValidate: true,
          });
        }
      }

      if (currentMessage.wardName != '') {
        const wardIndex = wardData.findIndex((item) =>
          item.ward.indexOf(currentMessage.wardName)
        );
        setWardName(wardName);
        messageSetValue('wardName', wardIndex.toString(), {
          shouldValidate: true,
        });
      }

      if (currentMessage.messageDate != null) {
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
  }, [user, wards, currentMessage, roles]);

  const [getUserCountForMessageCriteria, { data: totalUsers }] = useLazyQuery(
    GetUserCountForMessageCriteria,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        provinceId: messageGetValues('provinceId'),
        districtId: messageGetValues('districtId'),
        wardName: wardName,
        roleIds: selectedRoles.map(({ id }) => id),
      },
    }
  );

  useEffect(() => {
    if (totalUsers) {
      setUserCount(totalUsers.userCountForMessageCriteria);
    }
  }, [totalUsers]);

  const [isEdit, setEdit] = useState(props.message ? true : false);
  const [saveBulkMessagesForAdmin] = useMutation(SaveBulkMessagesForAdmin);
  const messageForm = messageGetValues();

  const onShowDialog = () => {
    getUserCountForMessageCriteria();
    setShowSavingDialog(true);
  };

  const onSaveMessage = async () => {
    const formValues = messageGetValues();

    let toGroups = '';
    if (formValues.districtId != '') {
      toGroups += 'District:' + formValues.districtId + '|';
    }
    if (wardName != '') {
      toGroups += 'Ward:' + wardName + '|';
    }
    if (formValues.provinceId != '') {
      toGroups += 'Province:' + formValues.provinceId + '|';
    }
    if (selectedRoles.length != 0) {
      toGroups += 'Role:' + selectedRoles.map(({ id }) => id);
    }

    const messageDate = formValues.messageDate;
    const messageTimeItems = formValues.messageTime.split(':');
    const hour = messageTimeItems[0];
    const minute = messageTimeItems[1];

    const inputModel: MessageLogDto = {
      districtId: formValues.districtId,
      wardName: wardName,
      provinceId: formValues.provinceId,
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
        props.closeDialog(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const panelSetRoles = async (roles: RoleDto[]) => {
    setSelectedRoles(roles);
  };

  useEffect(() => {
    if (messageForm) {
      // console.log('messageForm', messageForm);
      if (messageForm.wardName != '') {
        // console.log('wardname', messageForm.wardName);

        const wardIndex = +messageGetValues('wardName');
        //setWardName(wardData[wardIndex - 1].ward);
      }
    }
  }, [messageForm]);

  const getIsValid = () => {
    return isMessageValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        {isDirty && (
          <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
            <button
              className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
              onClick={() => setDisplayFormIsDirty(true)}
            >
              <span className="sr-only">Close panel</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
        <div>
          <div className="pb-2">
            <hr className="border-b border-dashed border-gray-500 px-2" />
            {props.messageStatus == 'completed' ? (
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
            editMessageDate={currentMessage?.messageDate ?? undefined}
            editRoles={selectedRoles}
            wardData={wardData}
            isView={props.isView}
          />

          <Button
            className="mt-3 mr-6 w-full rounded"
            type="filled"
            color="secondary"
            onClick={onShowDialog}
            disabled={!getIsValid() || props.isView}
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
                  props.closeDialog(false);
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
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={
              `Schedule message for ` +
              format(messageGetValues('messageDate'), 'dd MMMM') +
              ` at ` +
              messageGetValues('messageTime') +
              ` ?`
            }
            detailText={
              `This message will be sent to ` +
              userCount +
              ` people (` +
              selectedRoles.map((x) => {
                return x.name;
              }) +
              `).`
            }
            actionButtons={[
              {
                text: 'Yes schedule',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => onSaveMessage(),
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
