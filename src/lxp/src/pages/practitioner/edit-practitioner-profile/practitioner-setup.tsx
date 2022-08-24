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
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yesNoOptions } from './components/edit-programme-form/edit-programme-form.types';
import { setupPractitioner } from '@/schemas/practitioner/add-practitioner';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { PractitionerService } from '@/services/PractitionerService';
import { UserService } from '@/services/UserService';
import { authSelectors } from '@/store/auth';

export const PractitionerSetup = ({ onSubmit }: { onSubmit: () => void }) => {
  const [principalName, setPrincipalName] = useState<string>();
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const { control, register, watch } = useForm({
    resolver: yupResolver(setupPractitioner),
    defaultValues: {
      practitionerToProgramme: undefined,
      allowPermissions: undefined,
    },
  });

  const me = useSelector(userSelectors.getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const currentPractitioner = practitioners?.filter((x) => x.userId === me?.id);

  useEffect(() => {
    if (currentPractitioner?.length) {
      const [{ principalHierarchy }] = currentPractitioner;
      const principal = practitioners?.filter(
        (x) => x.principalHierarchy === principalHierarchy
      );

      if (principal?.length) {
        setPrincipalName(principal[0].user?.fullName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPractitioner]);

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
                text="Angel’s Daycare."
              />
            </div>
            <Divider dividerType="dashed" className="-my-1" />
          </div>
          <div className={'w-full'}>
            <label className={''}>
              Are you a practitioner at Angel’s Daycare?
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

          {practitionerToProgramme && (
            <Alert
              type={'warning'}
              title={
                'Ask the principal of the programme to add your details to their programme on Funda App.'
              }
            />
          )}

          {practitionerToProgramme !== undefined && (
            <Alert
              type={practitionerToProgramme ? 'info' : 'error'}
              title={
                practitionerToProgramme
                  ? 'You need to accept the agreement below to continue'
                  : 'Bulelwa will be notified and you will be removed from Angels Daycare.'
              }
            />
          )}

          {practitionerToProgramme && (
            <>
              <Typography
                type="h4"
                text="Permission to share information with programme
          principal/owner/administrator"
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
            disabled={!(practitionerToProgramme != null && allowPermissions)}
            onClick={() => {
              onSubmit();
            }}
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
