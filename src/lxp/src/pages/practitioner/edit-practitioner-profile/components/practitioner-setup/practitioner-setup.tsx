import Article from '@/components/article/article';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  Checkbox,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yesNoOptions } from '../edit-programme-form/edit-programme-form.types';
import { setupPractitioner } from '@/schemas/practitioner/add-practitioner';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { PractitionerFormData } from '../../edit-practitioner-profile.types';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { updatePrincipalInvitation } from '@/store/practitioner/practitioner.actions';
import { ClassroomService } from '@/services/ClassroomService';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { notificationActions } from '@/store/notifications';
import { useTenant } from '@/hooks/useTenant';
import { Message } from '@/models/messages/messages';
import { usePractitionerNotification } from '@/hooks/usePractitionerNotification';

export const PractitionerSetup = ({
  onSubmit,
}: {
  onSubmit: ({
    practitionerToProgramme,
    allowPermissions,
  }: PractitionerFormData) => void;
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const { control, register, watch, setValue, getValues } = useForm({
    resolver: yupResolver(setupPractitioner),
    defaultValues: {
      practitionerToProgramme: undefined,
      allowPermissions: false,
    },
  });

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const [principalClassroom, setPrincipalClassroom] = useState<ClassroomDto>();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const [isLoading, setIsLoading] = useState(false);
  const notificationClassroom = classroom?.name
    ? classroom?.name
    : principalClassroom?.name;

  const { getPractitionerProgressNotification } = usePractitionerNotification();

  const { practitionerNotification } = getPractitionerProgressNotification(
    tenant?.tenant?.applicationName,
    practitioner,
    notificationClassroom
  );

  const getPractitionerResponse = async () => {
    setIsLoading(true);
    const principalHierarchy = practitioner?.principalHierarchy!;
    const userId = user?.id!;
    const accepted = practitionerToProgramme!;

    await appDispatch(
      practitionerThunkActions.updatePractitionerProgress({
        practitionerId: userId,
        progress: 2.0,
      })
    ).unwrap();
    await appDispatch(
      updatePrincipalInvitation({ userId, principalHierarchy, accepted })
    );

    await appDispatch(
      practitionerThunkActions.getPractitionerByUserId({
        userId: user?.id!,
      })
    );
    await appDispatch(
      classroomsThunkActions.getClassroom({ overrideCache: true })
    ).unwrap();

    if (practitionerToProgramme === false) {
      await appDispatch(classroomsActions.resetClassroomState());
    }

    await appDispatch(notificationActions.resetFrontendNotificationState());

    await appDispatch(
      notificationActions.addNotifications(practitionerNotification)
    );

    setIsLoading(false);
  };

  useEffect(() => {
    if (practitioner?.principalHierarchy) {
      getPrincipalClassroom();
    }
  }, [practitioner?.principalHierarchy]);

  const getPrincipalClassroom = useCallback(async () => {
    const classroom = await new ClassroomService(
      userAuth?.auth_token!
    ).getClassroomForUser(practitioner?.principalHierarchy!);

    if (classroom) {
      setPrincipalClassroom(classroom);
    }
  }, [practitioner?.principalHierarchy]);

  const { practitionerToProgramme, allowPermissions } = watch();

  const checkClassroomNeedsToBeRemove = async () => {
    if (!practitionerToProgramme) {
      await appDispatch(classroomsActions.resetClassroomState());
    }
  };

  return (
    <>
      <div className="wrapper-with-sticky-button mt-4">
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-11">
            <div>
              <Card
                className="bg-uiBg mb-6 flex flex-col items-center gap-3 p-6"
                borderRaduis="xl"
                shadowSize="lg"
              >
                <div className="">
                  <Cebisa />
                </div>
                <Typography
                  color="textDark"
                  text={`Connect with your principal`}
                  type={'h3'}
                  align="center"
                />
              </Card>
            </div>
          </div>
        </div>
        {principalClassroom && (
          <div>
            <div>
              <div>
                <Typography
                  type="body"
                  text={`${principalClassroom?.principal.firstName} has added you to`}
                />
                <Typography
                  type="body"
                  weight="bold"
                  color="primary"
                  text={principalClassroom?.name}
                />
              </div>
              <Divider dividerType="dashed" className="py-4" />
            </div>
            <div className={'w-full'}>
              <label className={''}>
                {`Are you a practitioner at ${principalClassroom?.name}?`}
              </label>
              <div className="mt-1">
                <Controller
                  name={'practitionerToProgramme'}
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <ButtonGroup<boolean>
                      inputRef={ref}
                      options={yesNoOptions}
                      onOptionSelected={onChange}
                      selectedOptions={value}
                      color="quatenary"
                      type={ButtonGroupTypes.Button}
                      className={'w-full'}
                      notSelectedColor="quatenaryBg"
                      textColor="quatenary"
                    />
                  )}
                ></Controller>
              </div>
            </div>

            {practitionerToProgramme !== undefined && (
              <Alert
                type={practitionerToProgramme ? 'info' : 'warning'}
                title={
                  practitionerToProgramme
                    ? 'You need to accept the agreement below to continue'
                    : `${principalClassroom?.principal.firstName} will be notified and you will be removed from ${principalClassroom?.name}.`
                }
                className="my-4"
              />
            )}

            {practitionerToProgramme && (
              <>
                <Typography
                  type="h4"
                  text="Permission to share information with principal"
                />
                <div
                  className={`${false && 'border-errorDark border'} ${
                    false ? 'border-quatenary bg-quatenaryBg border' : 'bg-uiBg'
                  } bg-uiBg mt-2 flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
                >
                  <div className="flex">
                    <Checkbox
                      register={register}
                      checked={allowPermissions}
                      nameProp="allowPermissions"
                      className="mr-4 flex-1"
                      description="I accept that my information will be shared with the programme principal"
                    />
                    &nbsp;
                    <Button
                      color={'secondaryAccent2'}
                      type={'filled'}
                      text="Read"
                      textColor="secondary"
                      className={'rounded-xl'}
                      size={'small'}
                      onClick={() => setViewPermissionToShare(true)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="self-end">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="quatenary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            isLoading={isLoading}
            disabled={
              (practitionerToProgramme === true &&
                !allowPermissions &&
                practitioner?.shareInfo !== true) ||
              practitionerToProgramme === null ||
              practitionerToProgramme === undefined ||
              (isWhiteLabel &&
                !allowPermissions &&
                practitionerToProgramme !== false)
            }
            onClick={
              practitionerToProgramme === false
                ? async () => {
                    await getPractitionerResponse();
                    history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
                    await checkClassroomNeedsToBeRemove();
                  }
                : async () => {
                    await getPractitionerResponse();
                    await onSubmit({
                      practitionerToProgramme: !!practitionerToProgramme,
                      allowPermissions: !!allowPermissions,
                    });
                  }
            }
          />
        </div>
      </div>
      <Article
        visible={viewPermissionToShare}
        consentEnumType={ContentConsentTypeEnum.PermissionToShare}
        onClose={function (): void {
          setViewPermissionToShare(false);
        }}
      />
    </>
  );
};
