import { yupResolver } from '@hookform/resolvers/yup';
import {
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  Typography,
  renderIcon,
  classNames,
  Dropdown,
  Alert,
  DialogPosition,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as styles from './switch-principal.styles';
import { SwapPrincipalProps } from './switch-principal.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import { PractitionerService } from '@/services/PractitionerService';
import ROUTES from '@routes/routes';
import { SwapPrincipalPrompt } from './switch-principal-prompt';
import {
  SwitchPrincipalModel,
  initialSwitchPrincipalValues,
  switchPrincipalModelSchema,
} from '@/schemas/practitioner/switch-principal';
import { classroomsSelectors } from '@/store/classroom';

export const SwitchPrincipal: React.FC<SwapPrincipalProps> = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const authUser = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitionerUserId = practitioner?.userId;
  const classroom = useSelector(classroomsSelectors?.getClassroom);

  //Get list of practitioners for classroom
  const practitionersForClass = useMemo<
    { label: string; value: string }[]
  >(() => {
    return (
      ((practitioner?.isPrincipal
        ? practitioners?.filter((x) => x.userId !== practitionerUserId)
        : practitioners
      )
        ?.map((p) => {
          if (p?.user?.firstName && p?.user?.surname) {
            return {
              label: `${p?.user?.firstName} ${p?.user?.surname}`,
              value: p.userId,
            };
          }
          return undefined;
        })
        .filter(Boolean) as { label: string; value: string }[]) || []
    );
  }, [practitionerUserId, practitioner, practitioners]);

  const {
    getValues: getSwitchPrincipalFormValues,
    setValue: setSwitchPrincipalFormValues,
    trigger: triggerWithcPrincipalForm,
    control: removePractionerFormControl,
  } = useForm<SwitchPrincipalModel>({
    resolver: yupResolver(switchPrincipalModelSchema),
    mode: 'onChange',
    defaultValues: initialSwitchPrincipalValues,
  });

  const { isValid } = useFormState({
    control: removePractionerFormControl,
  });

  const handleFormSubmit = async (formValues: SwitchPrincipalModel) => {
    if (isValid) {
      await new PractitionerService(authUser?.auth_token || '').switchPrincipal(
        practitionerUserId!,
        formValues.newPrincipalId!
      );

      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
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
            title={`Your ${
              practitioner?.isPrincipal ? 'principal' : 'administrator'
            } rights will be removed immediately`}
            list={[
              'You will no longer be able to manage practitioners, create classes, or submit income statements.',
              'This role will immediately be given to a new practitioner and you coach will be notified',
            ]}
          />
        </div>
        <div className="py-4' px-4">
          <Typography
            type={'h1'}
            text={`Choose a new ${
              practitioner?.isPrincipal ? 'principal' : 'administrator'
            } for ${classroom?.name}`}
            color={'primary'}
            className={'pt-1'}
          />

          <label className={classNames(styles.label, 'mt-4')}>
            {`Which practitioner will replace you as ${
              practitioner?.isPrincipal ? 'principal' : 'administrator'
            }?`}
          </label>

          <div>
            <Dropdown
              placeholder={'Select practitioner'}
              list={practitionersForClass || []}
              fillType="clear"
              label={
                'Each programme must have one person responsible for administration on Funda App'
              }
              fullWidth
              className={'mt-3 w-11/12'}
              onChange={(item: any) => {
                setSwitchPrincipalFormValues('newPrincipalId', item);
                triggerWithcPrincipalForm();
              }}
            />
          </div>
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={() => {
              handleFormSubmit(getSwitchPrincipalFormValues());
              history.push(ROUTES.DASHBOARD);
            }}
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
              text={'Assign new principal'}
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

export default SwitchPrincipal;
