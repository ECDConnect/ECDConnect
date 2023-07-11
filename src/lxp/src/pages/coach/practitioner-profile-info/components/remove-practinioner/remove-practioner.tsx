import { ReasonForLeavingDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  FormInput,
  Typography,
  renderIcon,
  classNames,
  Dropdown,
  Alert,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  RemovePractionerModel,
  removePractionerModelSchema,
  initialRemovePractionerValues,
} from '@/schemas/practitioner/remove-practioner';
import * as styles from './remove-practioner.styles';
import { RemovePractionerReasonsProps as RemovePractionerProps } from './remove-practioner.types';
import { practitionerSelectors } from '@/store/practitioner';
import { staticDataSelectors } from '@store/static-data';
import { useStaticData } from '@hooks/useStaticData';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { PractitionerProfileRouteState } from '../../practitioner-profile-info.types';

export const RemovePractioner: React.FC<RemovePractionerProps> = ({
  userId,
}) => {
  const history = useHistory();
  const user = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const reasonsForLeaving = useSelector(
    staticDataSelectors.getReasonsForLeaving
  );
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  // Is there a better way to do this???
  const otherReasonId = reasonsForLeaving?.find(
    (x) => x.description === 'Other'
  )?.id;

  const appDispatch = useAppDispatch();

  const [reasonDetailsVisible, setReasonDetailsVisible] =
    useState<boolean>(false);
  const {
    getValues: getRemovePractionerFormValues,
    setValue: setRemovePractionerFormValues,
    trigger: triggerRemovePractionerForm,
    register: removePractionerFormRegister,
    control: removePractionerFormControl,
  } = useForm<RemovePractionerModel>({
    resolver: yupResolver(removePractionerModelSchema),
    mode: 'onChange',
    defaultValues: initialRemovePractionerValues,
  });

  const { isValid } = useFormState({
    control: removePractionerFormControl,
  });

  const { removeReasonId, reasonDetail } = useWatch({
    control: removePractionerFormControl,
    defaultValue: initialRemovePractionerValues,
  });

  //Don't think I need a back warning, just don't remove them...
  // useEffect(() => {
  //   if ((removeReasonId && removeReasonId.length > 0))) {
  //     setHasChangesOnNote(true);
  //   } else {
  //     setHasChangesOnNote(false);
  //   }
  // }, [title, body]);

  const handleFormSubmit = async (formValues: RemovePractionerModel) => {
    if (isValid) {
      //MATTODO - submit changes
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'uiBg'}
        renderBorder={true}
        title={`Remove ${practitioner?.user?.firstName}`}
        color={'primary'}
        displayOffline={!isOnline}
      >
        <div className="flex w-full justify-center">
          <Alert
            className="mt-10 w-11/12 rounded-xl"
            type={'error'}
            title={`${practitioner?.user?.firstName} will be removed from the programme immediately.`}
            list={[
              `If you remove ${practitioner?.user?.firstName} now, they will no longer be able to see child information or perform any actions in the classroom section.`,
            ]}
          />
        </div>
        <div className="py-4' px-4">
          <Typography
            type={'h1'}
            text={`Why is ${practitioner?.user?.firstName} leaving SmartStart?`}
            color={'primary'}
            className={'pt-1'}
          />

          <label className={classNames(styles.label, 'mt-4')}>
            {'Reason for leaving'}
          </label>
          <Dropdown<string>
            placeholder={'Choose reason'}
            fullWidth
            fillType="clear"
            list={
              (reasonsForLeaving &&
                reasonsForLeaving.map((x: ReasonForLeavingDto) => {
                  return { label: x.description, value: x.id || '' };
                })) ||
              []
            }
            selectedValue={getRemovePractionerFormValues().removeReasonId}
            onChange={(item) => {
              setRemovePractionerFormValues('removeReasonId', item);
              triggerRemovePractionerForm();
              setReasonDetailsVisible(item === otherReasonId);
            }}
          />
          {reasonDetailsVisible && (
            <FormInput<RemovePractionerModel>
              label={'Please add details'}
              className={'mt-3'}
              textInputType="textarea"
              register={removePractionerFormRegister}
              nameProp={'reasonDetail'}
              hint={'Optional'}
              placeholder={'E.g. Found the daily routine too difficult'}
              onChange={() => triggerRemovePractionerForm()}
            />
          )}
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={() => handleFormSubmit(getRemovePractionerFormValues())}
            className="w-full"
            size="small"
            color="errorMain"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text={'Remove SmartStarter'}
              color="white"
            />
          </Button>
          <Button
            onClick={() => history.goBack()}
            className="mt-4 w-full"
            size="small"
            color="primary"
            type="outlined"
          >
            {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
            <Typography
              type="h6"
              className="ml-2"
              text="Cancel"
              color="primary"
            />
          </Button>
        </div>
      </BannerWrapper>
    </>
  );
};

export default RemovePractioner;
