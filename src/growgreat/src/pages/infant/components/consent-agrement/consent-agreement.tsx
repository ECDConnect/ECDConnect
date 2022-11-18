import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Typography,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
} from '@ecdlink/ui';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  EditConsentAgreementProps,
  yesNoOptions,
} from './consent-agreement.types';
import {
  pregnantConsentModelSchema,
  PregnantConsentModel,
} from '@/schemas/pregnant/pregnant-consent';
import Article from '@/components/article/article';
import { ContentConsentTypeEnum } from '@ecdlink/core';

export const ConsentAgreement: React.FC<EditConsentAgreementProps> = ({
  onSubmit,
  multipleChildren,
  setMultipleChildren,
}) => {
  const {
    getValues: getConsentFormValues,
    // formState: consentFormState,
    setValue: setConsentFormValue,
    register: consentFormRegister,
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
    <div className="h-screen w-full justify-center">
      <Typography
        type="h2"
        color={'textDark'}
        text={'Agreements'}
        className="z-50 pt-6"
      />

      <Typography
        type="h4"
        color={'textMid'}
        text={'Are you registering more than one child under 2 years old?'}
        className="z-50 mt-2 w-full pt-2"
      />
      <div className="mt-2">
        <ButtonGroup<boolean>
          options={yesNoOptions}
          onOptionSelected={(value: boolean | boolean[]) => {
            setMultipleChildren(value as boolean);
          }}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={'mt-2 w-full'}
          selectedOptions={multipleChildren}
        />
      </div>
      {multipleChildren && (
        <div>
          <FormInput<PregnantConsentModel>
            label={'How many children do you need to register?'}
            register={consentFormRegister}
            nameProp={'numberOfChildren'}
            placeholder={'e.g. 2'}
            type={'text'}
            className="mt-4"
          ></FormInput>
        </div>
      )}

      <Divider
        className="flex w-11/12 justify-center text-red-400"
        dividerType="dashed"
      />

      <Typography
        type="h4"
        color={'textMid'}
        weight="bold"
        className="z-50 mt-4 w-11/12"
        text="Ask your client to read the consent agreement and tap the box if they agree."
      />

      <Divider
        dividerType="dashed"
        className="flex w-full justify-center text-red-400"
      />

      <div className="mt-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className={accept ? 'bg-secondary' : 'bg-uiBg'}
            onChange={() => {
              setAccept(!accept);
              handleConsentAccept();
            }}
          />
          <Typography
            text={'I accept the consent agreement'}
            type="body"
            color={'textMid'}
          />
        </div>
        <div>
          <Typography
            text={'View'}
            type="body"
            color={'secondary'}
            className="cursor-pointer underline"
            onClick={() => {
              displayArticle(
                ContentConsentTypeEnum.ConsentAgreement,
                'Photo Permissions'
              );
            }}
          />
        </div>
      </div>

      <Alert
        className="mt-6 flex w-11/12 items-center"
        type={'info'}
        message={
          'If the client does not consent, please do not register them on CHW Connect.'
        }
      />

      <div className="flex h-full w-full justify-center align-bottom">
        <Button
          type={'filled'}
          color={'primary'}
          className={
            'absolute bottom-10 m-auto mt-2 max-h-10 w-11/12 justify-center'
          }
          textColor={'white'}
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getConsentFormValues());
          }}
          disabled={!accept}
        />
      </div>
      <Article
        consentEnumType={contentConsentTypeEnum}
        visible={presentArticle}
        title={'Consent Agreement'}
        onClose={() => setPresentArticle(false)}
      />
    </div>
  );
};
