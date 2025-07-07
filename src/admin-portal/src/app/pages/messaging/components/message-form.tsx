import { useQuery } from '@apollo/client';
import { UseFormRegister } from 'react-hook-form';
import { GetAllProvince } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ProvinceDto, TenantDto, WardDto } from '@ecdlink/core';
import { DatePicker, FormInput, Typography } from '@ecdlink/ui';
import FormField from '../../../components/form-field/form-field';
import FormSelectorField from '../../../components/form-selector-field/form-selector-field';
import { MessageRoleDto, ssRoles } from './message';
import { useTenant } from '../../../hooks/useTenant';

export interface MessageFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
  messageSetValue: any;
  panelSetRoles: any;
  panelSetDate: any;
  editMessageDate: Date;
  editRoles: MessageRoleDto[];
  wardData: WardDto[];
  isView?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({
  formKey,
  errors,
  register,
  messageSetValue,
  panelSetRoles,
  panelSetDate,
  editMessageDate,
  editRoles,
  wardData,
  isView,
}) => {
  const [provinceData, setProvinceData] = useState<ProvinceDto[]>([]);
  const [roleData, setRoleData] = useState<MessageRoleDto[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<MessageRoleDto[]>(ssRoles);
  const [messageDate, setMessageDate] = useState<Date>(editMessageDate);
  const [messageText, setMessageText] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const tenant = useTenant();

  const { data: provinces } = useQuery(GetAllProvince, {
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
      const unknown: ProvinceDto = {
        id: 'Unknown',
        description: 'Unknown',
        enumId: '',
      };
      copyItems.unshift(newProvince);
      copyItems.push(unknown);
      setProvinceData(copyItems);
    }

    if (editRoles) {
      setSelectedRoles(editRoles);
    }

    if (editMessageDate) {
      setMessageDate(editMessageDate);
    }
  }, [provinces, tenant, editRoles, editMessageDate]);

  const onRoleSelectionChange = (item) => {
    if (!isView) {
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
      messageSetValue(
        'roleIds',
        updateSelectedRoles.map(({ id }) => id)
      );
      panelSetRoles(updateSelectedRoles);
    }
  };

  return (
    <form key={formKey}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid gap-y-6 gap-x-4 ">
          <div className="sm:col-span-3">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Which users would you like to send this message to?`}
              className={'mt-4 ml-4'}
            />

            {roleData &&
              roleData.map((item: MessageRoleDto) => (
                <div key={item.id} className="mt-1 ml-4 mr-4 flex items-center">
                  <div
                    className="bg-uiBg relative flex w-full items-center rounded p-1"
                    onClick={(e) => onRoleSelectionChange(item)}
                  >
                    <input
                      disabled={isView}
                      type="checkbox"
                      defaultChecked={
                        selectedRoles.length && selectedRoles.includes(item)
                      }
                      id={item.id}
                      className="focus:ring-primary text-primary h-4 w-4 rounded border-gray-300"
                    />
                    <Typography
                      text={item.label}
                      type="body"
                      color={'textMid'}
                      className="ml-2 p-1 text-sm font-medium text-gray-900"
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="ml-4 mr-4 sm:col-span-3">
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
              disabled={isView}
              options={
                provinceData &&
                provinceData.map((x: ProvinceDto) => {
                  return { key: x.id, value: x.description };
                })
              }
            />
          </div>
          <div className="ml-4 mr-4 sm:col-span-3">
            {
              tenant.isFundaApp ? (
                <>
                  <Typography
                    type={'body'}
                    color="textMid"
                    weight="bold"
                    text={`Select districts`}
                  />
                  <FormSelectorField
                    label="Optional - if you would like to send this message to users in a specific district only, select the district below."
                    nameProp={'wardName'}
                    register={register}
                    disabled={isView}
                    options={
                      wardData &&
                      wardData.map((x: WardDto, index) => {
                        return { key: x.ward, value: x.ward };
                      })
                    }
                  />
                </>
              ) : null // when districts for GG is available, we will add them here
            }
          </div>
          <div className="ml-4 mr-4 sm:col-span-3">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`When would you like to send this message?`}
            />
            <div className="center-items flex">
              <div className="w-full">
                <Typography
                  type={'markdown'}
                  weight="normal"
                  text={`Date`}
                  fontSize="18"
                />
                <DatePicker
                  placeholderText={`Click to choose a date`}
                  wrapperClassName="text-left"
                  name="messageDate"
                  disabled={isView}
                  className="text-textMid bg-uiBg mt-2 mr-4"
                  selected={messageDate ? new Date(messageDate) : undefined}
                  onChange={(date: Date) => {
                    setMessageDate(date);
                    messageSetValue('messageDate', date);
                    panelSetDate(date);
                  }}
                  minDate={new Date()}
                  dateFormat="EEE, dd MMM yyyy"
                />
              </div>
              <div className="ml-4 mr-4 w-full">
                <FormField
                  label={'Time'}
                  nameProp={'messageTime'}
                  type="time"
                  disabled={isView}
                  register={register}
                  error={errors.messageTime?.message}
                />
              </div>
            </div>
          </div>
          <div className="mr-4 ml-4 sm:col-span-3">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Message title*`}
            />
            <Typography
              type={'markdown'}
              fontSize={'16'}
              text={'Character limit: 50'}
            />
            <FormInput
              register={register}
              error={errors.subject?.message}
              nameProp={'subject'}
              placeholder="Message title"
              label=""
              type={'text'}
              maxCharacters={50}
              maxLength={50}
              disabled={isView}
              value={messageTitle}
              onChange={(event) => {
                setMessageTitle(event.target.value);
                messageSetValue('subject', event.target.value);
              }}
            ></FormInput>
          </div>
          <div className="mr-4 ml-4 sm:col-span-3">
            <Typography
              type={'body'}
              color="textMid"
              weight="bold"
              text={`Message text*`}
            />
            <Typography
              type={'markdown'}
              fontSize={'16'}
              text={'Character limit: 160'}
            />
            <FormInput
              register={register}
              error={errors.message?.message}
              nameProp={'message'}
              placeholder="Message text"
              label=""
              type={'text'}
              textInputType={'textarea'}
              maxCharacters={160}
              maxLength={160}
              disabled={isView}
              value={messageText}
              onChange={(event) => {
                setMessageText(event.target.value);
                messageSetValue('message', event.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageForm;
