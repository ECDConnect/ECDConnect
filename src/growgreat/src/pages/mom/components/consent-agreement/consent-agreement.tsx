import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { Button, Divider, Typography, Alert } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditConsentAgreementProps } from '@/pages/mom/components/consent-agreement/consent-agreement.types';
import {
  pregnantConsentModelSchema,
  PregnantConsentModel,
} from '@/schemas/pregnant/pregnant-consent';
import Article from '@/components/article/article';

export const ConsentAgreement: React.FC<EditConsentAgreementProps> = ({
  onSubmit,
}) => {
  const {
    getValues: getConsentFormValues,
    // formState: consentFormState,
    setValue: setConsentFormValue,
    // register: consentFormRegister,
    // reset: resetConsentFormValue,
    // control: consentFormControl,
  } = useForm<PregnantConsentModel>({
    resolver: yupResolver(pregnantConsentModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>(ContentConsentTypeEnum.PhotoPermissions);
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [accept, setAccept] = useState(false);
  function handleConsentAccept() {
    setConsentFormValue('hasConsent', !accept);
  }
  function displayArticle(key: ContentConsentTypeEnum, title: string) {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
  }
  function toggleConsentAgreement() {
    setAccept(!accept);
    handleConsentAccept();
  }

  if (presentArticle === false) {
    return (
      <div className="flex h-screen w-full flex-col">
        <div className="flex flex-col px-5">
          <Typography
            type="h2"
            color={'textDark'}
            text={'Agreements'}
            className="z-50 pt-3"
          />
          <Typography
            type="h4"
            color={'textMid'}
            className="z-50 py-2"
            text="Ask your client to read the consent agreement and tap the box if they agree."
          />
          <Divider dividerType="dashed" className="my-2" />
          <Typography
            type="h4"
            color={'textDark'}
            className="z-50 w-full py-2"
            text={'Check to confirm that you agree with the following:'}
          />
          <div className="flex w-full w-screen flex-row items-center py-2">
            <input
              type="checkbox"
              checked={!!accept}
              onChange={toggleConsentAgreement}
              className={accept ? 'bg-secondary' : 'bg-uiBg'}
            />
            <Typography
              type="body"
              color={'textMid'}
              onClick={toggleConsentAgreement}
              className="w-9/12 pl-2 md:w-11/12"
              text={'I accept the consent agreement'}
            />
            <Typography
              text={'View'}
              type="body"
              color={'secondary'}
              className="cursor-pointer justify-end underline"
              onClick={() =>
                displayArticle(
                  ContentConsentTypeEnum.ConsentAgreement,
                  'Consent Agreement'
                )
              }
            />
          </div>
          <Alert
            type="info"
            className="mt-4 flex flex-col items-center justify-center"
            message="If the client does not consent, please do not register them on CHW Connect."
          />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-end px-5 py-4">
          <div className="mb-16 w-full items-center justify-center">
            <Button
              text={`Next`}
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              disabled={!accept}
              iconPosition={'start'}
              icon={'ArrowCircleRightIcon'}
              className={'absolute bottom-10 m-auto mt-2 max-h-10 w-11/12'}
              onClick={() => onSubmit(getConsentFormValues())}
            />
          </div>
        </div>
      </div>
    );
  }

  if (presentArticle) {
    return (
      <Article
        visible={presentArticle}
        title={'Consent Agreement'}
        consentEnumType={contentConsentTypeEnum}
        onClose={() => setPresentArticle(false)}
      />
    );
  }

  return null;
};
