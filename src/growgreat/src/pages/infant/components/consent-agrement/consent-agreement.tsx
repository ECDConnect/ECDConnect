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
  console.log(getConsentFormValues());

  const handleConsentAccept = () => {
    setConsentFormValue('hasConsent', !accept);
  };

  const displayArticle = (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
  };

  return (
    <div className="ml-4 h-screen ">
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={'Agreements'}
          className="z-50 pt-6"
        />
        <div className="mt-4 w-11/12">
          <Typography
            type="h4"
            color={'textMid'}
            text={'Are you registering more than one child under 2 years old?'}
            className="z-50 pt-2 w-11/12"
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
        </div>
        <div className="flex justify-center w-11/12 text-red-400">
          <Divider dividerType="dashed" />
        </div>
        <Typography
          type="h4"
          color={'textMid'}
          weight="bold"
          text={
            'Ask your client to read the consent agreement and tap the box if they agree.'
          }
          className="z-50 mt-4 w-11/12"
        />
      </div>
      <div className="flex justify-center w-11/12 text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div>
        <div className="flex w-11/12 justify-between items-center mt-4">
          <div className="flex gap-2 items-center">
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
              className="underline cursor-pointer"
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.ConsentAgreement,
                  'Photo Permissions'
                );
              }}
            />
          </div>
        </div>
        <div className="flex items-center mt-6 w-11/12">
          <Alert
            type={'info'}
            message={
              'If the client does not consent, please do not register them on CHW Connect.'
            }
          ></Alert>
        </div>
      </div>
      <div className="flex w-full h-full align-bottom">
        <div className={'mt-10 w-11/12 flex justify-center align-bottom'}>
          <Button
            type={'filled'}
            color={'primary'}
            className={'mt-2 m-auto w-11/12 max-h-10 absolute bottom-10'}
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
