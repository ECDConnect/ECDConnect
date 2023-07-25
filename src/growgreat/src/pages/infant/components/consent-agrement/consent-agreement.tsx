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
import { useForm, useFormState } from 'react-hook-form';
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
    control: consentFormControl,
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

  const { errors } = useFormState({
    control: consentFormControl,
  });

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
        className="pt-6"
      />

      <Typography
        type="h4"
        color={'textMid'}
        text={'Are you registering more than one child under 2 years old?'}
        className="mt-2 w-full pt-2"
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
        />
      </div>
      {multipleChildren && (
        <div>
          <FormInput<PregnantConsentModel>
            label={'How many children do you need to register?'}
            register={consentFormRegister}
            nameProp={'numberOfChildren'}
            placeholder={'e.g. 2'}
            type={'number'}
            className="mt-4"
            error={
              !!errors.numberOfChildren ? errors.numberOfChildren : undefined
            }
          ></FormInput>
        </div>
      )}

      <Divider
        className="mt-4 flex justify-center text-red-400"
        dividerType="dashed"
      />

      <Typography
        type="h4"
        color={'textMid'}
        weight="bold"
        className="mt-4 w-11/12"
        text="Ask your client to read the consent agreement and tap the box if they agree."
      />

      <Divider
        dividerType="dashed"
        className="mt-4 flex w-full justify-center text-red-400"
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
        className="mt-6 flex items-center"
        type={'info'}
        message={
          'If the client does not consent, please do not register them on CHW Connect.'
        }
      />

      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'mt-4 w-full'}
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
    </>
  );
};
