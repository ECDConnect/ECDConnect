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
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>(ContentConsentTypeEnum.PhotoPermissions);
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [accept, setAccept] = useState(false);

  const handleConsentAccept = () => {
    setConsentFormValue('hasConsent', !accept);
  };

  const displayArticle = (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
  };

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={'Agreements'}
        className="z-50 pt-6"
      />

      <Typography
        type="h4"
        color={'textMid'}
        className="z-50 py-2"
        text={
          'Ask your client to read the consent agreement and tap the box if they agree.'
        }
      />

      <Divider dividerType="dashed" />

      <Typography
        type="h4"
        color={'textDark'}
        text={'Check to confirm that you agree with the following:'}
        className="z-50 w-full py-2"
      />

      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-around gap-3">
          <input
            type="checkbox"
            className={accept ? 'bg-secondary' : 'bg-uiBg'}
            onChange={() => {
              setAccept(!accept);
              handleConsentAccept();
            }}
          />

          <Typography
            type="body"
            color={'textMid'}
            text={'I accept the consent agreement'}
          />

          <Typography
            text={'View'}
            type="body"
            color={'secondary'}
            className="cursor-pointer text-right underline"
            onClick={() =>
              displayArticle(
                ContentConsentTypeEnum.ConsentAgreement,
                'Photo Permissions'
              )
            }
          />
        </div>
        <Alert
          type={'info'}
          className="mt-4 flex w-full items-center justify-center"
          message={
            'If the client does not consent, please do not register them on CHW Connect.'
          }
        />
      </div>

      <div className="flex h-full items-end">
        <Button
          text={`Next`}
          type={'filled'}
          color={'primary'}
          disabled={!accept}
          textColor={'white'}
          iconPosition={'start'}
          icon={'ArrowCircleRightIcon'}
          className={'mt-4 w-full'}
          onClick={() => onSubmit(getConsentFormValues())}
        />
      </div>
      <Article
        visible={presentArticle}
        title={'Consent Agreement'}
        consentEnumType={contentConsentTypeEnum}
        onClose={() => setPresentArticle(false)}
      />
    </>
  );
};
