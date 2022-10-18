import Article from '@/components/article/article';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yesNoOptions } from '../edit-programme-form/edit-programme-form.types';
import { setupPractitioner } from '@/schemas/practitioner/add-practitioner';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
import { OnNext } from '@/pages/principal/setup-principal/setup-principal.types';
import { PractitionerFormData } from '../../edit-practitioner-profile.types';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';

export const PractitionerSetup = ({
  onSubmit,
}: {
  onSubmit: ({
    practitionerToProgramme,
    allowPermissions,
  }: PractitionerFormData) => void;
}) => {
  const history = useHistory();
  const [principalName, setPrincipalName] = useState<string>('Principal');
  const [programName, setProgramName] = useState<string>('Programme');
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const { control, register, watch } = useForm({
    resolver: yupResolver(setupPractitioner),
    defaultValues: {
      practitionerToProgramme: undefined,
      allowPermissions: undefined,
    },
  });

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);

  useEffect(() => {
    const getClassroomDetails = async () => {
      const res = await new PractitionerService(
        userAuth?.auth_token || ''
      ).getClassroomDetailsForPractitioner(user?.id || '');
      return res;
    };

    getClassroomDetails().then((data) => {
      setProgramName(data?.classroomName || '');
      setPrincipalName(data?.principalName || '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPractitionerResponse = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      user?.id!,
      practitioner?.principalHierarchy!,
      practitionerToProgramme
    );
  };

  const { practitionerToProgramme, allowPermissions } = watch();

  return (
    <>
      <div className="mt-4 wrapper-with-sticky-button">
        <div className="grid gap-4">
          <div>
            <Typography
              type="h2"
              className="inline"
              text="Your programme information"
            />
          </div>
          <div>
            <Divider dividerType="dashed" className="-my-1" />
            <div className="py-4">
              <Typography
                type="body"
                text={`${principalName} has added you to`}
              />
              <Typography
                type="body"
                weight="bold"
                color="primary"
                text={programName}
              />
            </div>
            <Divider dividerType="dashed" className="-my-1" />
          </div>
          <div className={'w-full'}>
            <label className={''}>
              {`Are you a practitioner at ${programName}?`}
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
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
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
                  : `${principalName} will be notified and you will be removed from ${programName}.`
              }
            />
          )}

          {practitionerToProgramme && (
            <>
              <Typography
                type="h4"
                text="Permission to share information with programme principal/owner/administrator"
              />
              <div className="flex">
                <Checkbox
                  register={register}
                  nameProp="allowPermissions"
                  className="flex-1"
                  description="I accept that my information will be shared with the programme principal"
                />
                <Typography
                  underline
                  color="secondary"
                  className="ml-2 flex-0 flex items-center font-medium cursor-pointer"
                  type="body"
                  text="Learn more"
                  onClick={() => setViewPermissionToShare(true)}
                />
              </div>
            </>
          )}
        </div>

        <div className="self-end">
          <Button
            size="normal"
            className="w-full mb-4"
            type="filled"
            color="primary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            disabled={
              (practitionerToProgramme === true && !allowPermissions) ||
              practitionerToProgramme === null ||
              practitionerToProgramme === undefined
            }
            onClick={
              practitionerToProgramme === false
                ? () => {
                    getPractitionerResponse();
                    history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
                  }
                : () => {
                    getPractitionerResponse();
                    onSubmit({
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
