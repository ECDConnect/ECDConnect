import Article from '@/components/article/article';
import { ContentConsentTypeEnum, LanguageDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Typography,
  Dropdown,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
// import { yesNoOptions } from '../edit-programme-form/edit-programme-form.types';
import { setupPractitioner } from '@/schemas/practitioner/add-practitioner';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
// import { OnNext } from '@/pages/principal/setup-principal/setup-principal.types';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { staticDataSelectors } from '@/store/static-data';
// import { practitionerSelectors } from '@/store/practitioner';

export const PractitionerSetup = ({
  onSubmit,
}: {
  onSubmit: (item: string) => void;
}) => {
  const history = useHistory();
  const [principalName, setPrincipalName] = useState<string>('Principal');
  const [programName, setProgramName] = useState<string>('Programme');
  const languages = useSelector(staticDataSelectors?.getLanguages);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const { control, register, watch, setValue } = useForm({
    resolver: yupResolver(setupPractitioner),
    defaultValues: {
      language: '',
    },
  });

  // const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);

  const { language } = watch();
  console.log({ language });

  return (
    <>
      <div className="wrapper-with-sticky-button mt-4">
        <div className="grid gap-4">
          <div>
            <Typography
              type="h2"
              className="inline"
              text="Choose your language"
            />
          </div>
          <div>
            <Divider dividerType="dashed" className="-my-1" />
            <div>
              <label className="text-h3 text-dark  block">
                What language would you like to use on CHW Connect?
              </label>
            </div>
            <Dropdown
              placeholder={'Tap to choose language'}
              list={
                (languages &&
                  languages.map((language: LanguageDto) => {
                    return { label: language.description, value: language.id };
                  })) ||
                []
              }
              fillType="clear"
              fullWidth
              // label={'Language'}
              className="mb-4"
              selectedValue={language}
              onChange={(item: any) => {
                setValue('language', item);
              }}
            />
            <Alert
              className={'mx-4'}
              type={'info'}
              title={'You can change this language in your profile in future.'}
              list={[
                'If the content is not available in your chosen language, it will be shown in English.',
              ]}
            />
            <Divider dividerType="dashed" className="-my-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-h-20 p-4">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            // disabled={
            //   (practitionerToProgramme === true && !allowPermissions) ||
            //   practitionerToProgramme === null ||
            //   practitionerToProgramme === undefined
            // }
            onClick={() => {
              // getPractitionerResponse();
              onSubmit(language);
            }}
          />
        </div>
      </div>
    </>
  );
};
