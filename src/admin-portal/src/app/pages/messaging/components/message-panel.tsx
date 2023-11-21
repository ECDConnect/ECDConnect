import {
  Alert,
  Button,
  DatePicker,
  Typography,
  FormInput,
  DialogPosition,
} from '@ecdlink/ui';
import { CalendarIcon } from '@heroicons/react/solid';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  GetAllProvince,
  FilterRoleList,
  GetUserCountForMessageCriteria,
} from '@ecdlink/graphql';
import FormSelectorField from '../../../components/form-selector-field/form-selector-field';
import {
  ProvinceDto,
  RoleDto,
  useDialog,
  MessageLogDto,
  LocalStorageKeys,
  AuthUser,
} from '@ecdlink/core';
import { useCallback, useEffect, useState } from 'react';
import AlertError from '../../../components/alerts/error';
import AlertModal from '../../../components/dialog-alert/dialog-alert';
import { format } from 'date-fns';

export interface PanelProps {
  message?: any;
  closeDialog: (value: boolean) => void;
}

export default function MessagePanel(props: PanelProps) {
  const dialog = useDialog();
  const [provinceData, setProvinceData] = useState<ProvinceDto[]>([]);
  // const [regionData, setRegionData] = useState<string[]>([]);
  const [roleData, setRoleData] = useState<RoleDto[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleDto[]>([]);
  const [messageDate, setMessageDate] = useState<Date>(null);
  const [messageText, setMessageText] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();
  const [userCount, setUserCount] = useState(0);
  const [isEdit, setEdit] = useState(props.message ? true : false);
  const user = localStorage.getItem(LocalStorageKeys.user);

  const { data: provinces } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  // const { data: regions } = useQuery(GetAllRegions, {
  //     fetchPolicy: 'cache-and-network',
  // });

  const { data: roles } = useQuery(FilterRoleList, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (provinces) {
      const copyItems = Object.assign([], provinces.GetAllProvince);
      const newProvince: ProvinceDto = {
        id: '',
        description: 'Click to choose a province',
        enumId: '',
      };
      copyItems.unshift(newProvince);
      setProvinceData(copyItems);
    }
    if (roles) {
      setRoleData(roles.roles);
    }
    // if (regions) {
    //     setRegionData(regions.GetAllRegions);
    // }

    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
  }, [provinces, roles, user]);

  // Form
  const messageSchema = yup.object().shape({
    messageTitle: yup
      .string()
      .required('Message title is required')
      .max(50, 'Message title too long'),
    messageText: yup
      .string()
      .required('Message text is required')
      .max(160, 'Message text too long'),
    messageDate: yup.date().required('Message date is required'),
    messageTime: yup.string().required('Message time is required'),
    roleNames: yup.array(),
    provinceId: yup.string(),
  });

  const initialMessageValues = {
    messageTitle: '',
    messageText: '',
    messageDate: new Date(),
    messageTime: '',
    roleNames: [],
    provinceId: '',
    wardName: '',
    districtId: '',
  };

  const { register, handleSubmit, setValue, formState, getValues } = useForm({
    resolver: yupResolver(messageSchema),
    defaultValues: initialMessageValues,
    mode: 'onChange',
  });
  const { errors, isValid, isSubmitted } = formState;

  const onRoleSelectionChange = (item) => {
    const isSelected = selectedRoles.includes(item);
    let updateSelectedRoles = [];

    if (isSelected) {
      updateSelectedRoles = selectedRoles.filter(
        (selectedRow) => selectedRow !== item
      );
    } else {
      updateSelectedRoles = [...selectedRoles, item];
    }
    setSelectedRoles(updateSelectedRoles);
  };

  const onShowDialog = () => {
    if (Object.keys(errors).length === 0) {
      // get user count for selected criteria

      saveDialog();
    }
  };

  const { data: totalUsers, refetch: refetchTotalUsers } = useQuery(
    GetUserCountForMessageCriteria,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        provinceId: getValues('provinceId'),
        districtId: getValues('districtId'),
        wardName: getValues('wardName'),
        roleIds: selectedRoles.map(({ id }) => id),
      },
    }
  );

  useEffect(() => {
    if (totalUsers) {
      setUserCount(totalUsers.userCountForMessageCriteria);
    }
  }, [totalUsers]);

  const onSaveMessage = async () => {
    if (isEdit) {
      // edit message
    } else {
      const formValues = getValues();
      const inputModel: MessageLogDto = {
        districtId: '',
        provinceId: formValues.provinceId,
        toGroups: selectedRoles.map(({ id }) => id),
        sendByUserId: authenticatedUser.id,
        message: formValues.messageText,
        messageDate: formValues.messageDate,
        messageTime: formValues.messageTime,
        subject: formValues.messageTitle,
      };

      console.log('inputmodel', inputModel);
      // add message
    }
  };

  const getErrors = () => {
    const currentErrors = [];
    if (selectedRoles.length == 0) {
      currentErrors.push('Roles are required');
    } else {
      if (
        selectedRoles.findIndex((x) => x.name === 'Community Health Worker') !=
          -1 ||
        selectedRoles.findIndex((x) => x.name === 'Team Lead') != -1
      ) {
        if (errors.provinceId?.message) {
          currentErrors.push(errors.provinceId?.message);
        }
      }
    }
    if (messageDate == undefined)
      currentErrors.push('Message date is required');
    if (errors.messageTime?.message)
      currentErrors.push(errors.messageTime?.message);
    if (errors.messageTitle?.message)
      currentErrors.push(errors.messageTitle?.message);
    if (errors.messageText?.message)
      currentErrors.push(errors.messageText?.message);

    messageSchema.isValidSync(getValues());

    if (Object.keys(errors).length === 0) {
      setFormIsValid(true);
    }
    return currentErrors;
  };

  const saveDialog = async () => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={
            `Schedule message for ` +
            format(getValues('messageDate'), 'dd MMMM') +
            ` at ` +
            getValues('messageTime') +
            ` ?`
          }
          btnText={['Yes schedule', 'No cancel']}
          message={
            `This message will be sent to ` +
            userCount +
            ` people (` +
            selectedRoles.map((x) => {
              return x.name;
            }) +
            `).`
          }
          onCancel={onCancel}
          onSubmit={() => {
            onSaveMessage();
            onCancel();
          }}
        />
      ),
    });
  };

  return (
    <div>
      <hr className="border-b border-dashed border-gray-500 px-2" />

      <Alert
        className="mt-2 mb-2 rounded-md"
        message={`Messages will only be sent to active users.`}
        type="info"
      />

      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-0">
          <div className="grid grid-cols-1 ">
            <div className="my-4 sm:col-span-3">
              <Typography
                type={'body'}
                color="textMid"
                weight="bold"
                text={`Which users would you like to send this message to?`}
                className={'mt-4 ml-4'}
              />

              {roleData &&
                roleData.map((item: any) => (
                  <div
                    key={item.id}
                    className="mt-1 ml-4 mr-4 flex items-center"
                  >
                    <div
                      className="bg-uiBg relative flex w-full items-center rounded p-1"
                      onClick={(e) => onRoleSelectionChange(item)}
                    >
                      <input
                        type="checkbox"
                        name="roleNames"
                        checked={selectedRoles.includes(item)}
                        id={item.id}
                        {...register('roleNames')}
                        className="focus:ring-primary text-primary h-4 w-4 rounded border-gray-300"
                      />
                      <Typography
                        text={item.name}
                        type="body"
                        color={'textMid'}
                        className="ml-2 p-1 text-sm font-medium text-gray-900"
                      />
                    </div>
                  </div>
                ))}

              <div className="mt-4 ml-4 mr-4">
                <Typography
                  type={'body'}
                  color="textMid"
                  weight="bold"
                  text={`Select provinces`}
                />

                <FormSelectorField
                  label="Optional - if you would like to send this message to users in a specific province only, select the province below."
                  nameProp={'provinceId'}
                  register={register}
                  options={
                    provinceData &&
                    provinceData.map((x: ProvinceDto) => {
                      return { key: x.id, value: x.description };
                    })
                  }
                />
              </div>
              {/* Pending until development for districts are completed */}
              {/* <div className="mt-4 ml-4 mr-4">
                                <Typography
                                    type={'body'}
                                    color="textMid"
                                    weight="bold"
                                    text={`Select districts`}
                                    />

                                <FormSelectorField
                                    label="Optional - if you would like to send this message to users in a specific district only, select the district below."
                                    nameProp={'districtName'}
                                    register={register}
                                    options={
                                        regionData &&
                                        regionData.map((x: any) => {
                                            return { key: x.ward, value: x.ward };
                                        })
                                    }
                                    />
                            </div> */}

              <div className="gap-2">
                <Typography
                  type={'body'}
                  color="textMid"
                  weight="bold"
                  text={`When would you like to send this message?`}
                  className={'mt-4 ml-4'}
                />
                <div className="center-items flex">
                  <div className="ml-4 w-full">
                    <Typography
                      type={'markdown'}
                      weight="normal"
                      text={`Date`}
                    />
                    <DatePicker
                      placeholderText={`Click to choose a date`}
                      wrapperClassName="text-left"
                      name="messageDate"
                      className="text-textMid bg-uiBg ml-4"
                      selected={messageDate ? new Date(messageDate) : undefined}
                      onChange={(date: Date) => {
                        setMessageDate(date);
                        setValue('messageDate', date);
                      }}
                      minDate={new Date()}
                      dateFormat="EEE, dd MMM yyyy"
                    />
                  </div>
                  <div className="ml-4 mr-4 w-full">
                    <Typography
                      type={'markdown'}
                      weight="normal"
                      text={`Time`}
                    />
                    <span>
                      <input
                        type="time"
                        name="messageTime"
                        {...register('messageTime')}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="gap-2">
                <Typography
                  type={'body'}
                  color="textMid"
                  weight="bold"
                  text={`Message title*`}
                  className={'mt-4 ml-4'}
                />
                <Typography
                  type={'markdown'}
                  fontSize={'16'}
                  text={'Character limit: 50'}
                  className={'ml-4'}
                />
                <FormInput
                  register={register}
                  nameProp={'messageTitle'}
                  placeholder="Message title"
                  label=""
                  type={'text'}
                  maxCharacters={50}
                  maxLength={50}
                  className={'ml-4 mr-4'}
                  value={messageTitle}
                  onChange={(event) => {
                    setMessageTitle(event.target.value);
                    setValue('messageTitle', event.target.value);
                  }}
                ></FormInput>
              </div>
              <div className="gap-2">
                <Typography
                  type={'body'}
                  color="textMid"
                  weight="bold"
                  text={`Message text*`}
                  className={'mt-4 ml-4'}
                />
                <Typography
                  type={'markdown'}
                  fontSize={'16'}
                  text={'Character limit: 160'}
                  className={'ml-4'}
                />
                <FormInput
                  register={register}
                  nameProp={'messageText'}
                  placeholder="Message text"
                  label=""
                  type={'text'}
                  textInputType={'textarea'}
                  maxCharacters={160}
                  maxLength={160}
                  className={'ml-4 mr-4'}
                  value={messageText}
                  onChange={(event) => {
                    setMessageText(event.target.value);
                    setValue('messageText', event.target.value);
                  }}
                />
              </div>
              {isSubmitted && !formIsValid ? (
                <div className="pt-8">
                  <AlertError alertMessage="Form Errors" errors={getErrors()} />
                </div>
              ) : null}
              <Button
                className="mt-3 mr-6 w-full rounded"
                type="filled"
                color="secondary"
                onClick={handleSubmit(onShowDialog)}
              >
                <CalendarIcon color="white" className="mr-6 h-6 w-6" />
                <Typography
                  type="help"
                  color="white"
                  text="Schedule message"
                ></Typography>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
