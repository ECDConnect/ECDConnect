import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  CheckboxChange,
  classNames,
  Dialog,
  DialogPosition,
  Divider,
  ImageInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Path, useForm } from 'react-hook-form';
import Article from '../../../../components/article/article';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import {
  ChildRegistrationFormModel,
  getChildRegistrationFormSchema,
} from '@schemas/child/child-registration/child-registration-form';
import * as styles from './child-registration-form.styles';
import { ChildRegistrationFormProps } from './child-registration-form.types';

const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

const acceptedFormats = ['jpg'];

export const ChildRegistrationForm: React.FC<ChildRegistrationFormProps> = ({
  onSubmit,
  childRegisterForm,
  variation = 'practitioner',
}) => {
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>(ContentConsentTypeEnum.PhotoPermissions);
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [articleTitle, setArticleTitle] = useState<string>();
  const [registrationFormPhotoUrl, setRegistrationFormPhotoUrl] =
    useState<string>();
  const [photoConsent, setPhotoConsent] = useState<boolean>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);

  const {
    formState: childRegistrationFormState,
    getValues: getChildRegistrationFormValues,
    setValue: setChildRegistrationFormValue,
    reset: resetChildRegistrationFormValue,
    register: childRegistrationFormRegister,
    trigger,
    watch,
  } = useForm<ChildRegistrationFormModel>({
    resolver: yupResolver(getChildRegistrationFormSchema(variation)),
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { isValid } = childRegistrationFormState;
  const { childPhotoConsentAccepted } = watch();

  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childPhotoConsentAccepted]);

  useEffect(() => {
    if (childRegisterForm) {
      resetChildRegistrationFormValue(childRegisterForm);
      setPhotoConsent(childRegisterForm.childPhotoConsentAccepted);
      setRegistrationFormPhotoUrl(childRegisterForm.registrationForm);
    }
  }, [childRegisterForm, resetChildRegistrationFormValue]);

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildRegistrationFormValues());
    }
  };

  const checkAcceptance = (
    nameProp: Path<ChildRegistrationFormModel>,
    checkboxChange: CheckboxChange
  ) => {
    setChildRegistrationFormValue(nameProp, checkboxChange.checked, {
      shouldValidate: true,
    });
  };

  const displayArticle = (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  const setPhotoUrl = (imageUrl: string) => {
    setChildRegistrationFormValue('registrationForm', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger();
  };

  return (
    <>
      <div className={'flex h-full flex-1 overflow-scroll bg-white'}>
        {variation === 'practitioner' && (
          <PractitionerForm
            registrationFormPhotoUrl={registrationFormPhotoUrl}
            setPhotoActionBarVisible={setPhotoActionBarVisible}
            childRegistrationFormRegister={childRegistrationFormRegister}
            setChildRegistrationFormValue={setChildRegistrationFormValue}
            displayArticle={displayArticle}
            setPhotoConsent={setPhotoConsent}
            photoConsent={photoConsent}
            checkAcceptance={checkAcceptance}
            handleFormSubmit={handleFormSubmit}
            isValid={isValid}
          />
        )}

        {variation === 'caregiver' && (
          <CaregiverForm
            childRegistrationFormRegister={childRegistrationFormRegister}
            displayArticle={displayArticle}
            checkAcceptance={checkAcceptance}
            handleFormSubmit={handleFormSubmit}
            setChildRegistrationFormValue={setChildRegistrationFormValue}
            setPhotoConsent={setPhotoConsent}
            photoConsent={photoConsent}
            isValid={isValid}
          />
        )}

        <Article
          consentEnumType={contentConsentTypeEnum}
          visible={presentArticle}
          title={articleTitle}
          onClose={() => setPresentArticle(false)}
        />
      </div>
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Middle}
        stretch
      >
        <PhotoPrompt
          title="Child registration form"
          onClose={() => setPhotoActionBarVisible(false)}
          onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
          onDelete={
            registrationFormPhotoUrl
              ? () => {
                  setChildRegistrationFormValue('registrationForm', '');
                  setRegistrationFormPhotoUrl(undefined);
                  setPhotoActionBarVisible(false);
                  trigger();
                  if (!childRegisterForm) return;

                  childRegisterForm.registrationForm = '';
                }
              : undefined
          }
        ></PhotoPrompt>
      </Dialog>
    </>
  );
};

const PractitionerForm: React.FC<any> = ({
  registrationFormPhotoUrl,
  setPhotoActionBarVisible,
  childRegistrationFormRegister,
  setChildRegistrationFormValue,
  displayArticle,
  setPhotoConsent,
  photoConsent,
  checkAcceptance,
  handleFormSubmit,
  isValid,
}) => {
  return (
    <div className={'w-full p-4'}>
      <Alert
        type={'info'}
        message={
          'Use the completed child registration form to fill in child and caregiver information'
        }
      ></Alert>
      <ImageInput<ChildRegistrationFormModel>
        acceptedFormats={acceptedFormats}
        label={'Take a photo of the signed child registration form (F4)'}
        nameProp="registrationForm"
        icon="CameraIcon"
        className={'pt-4'}
        currentImageString={registrationFormPhotoUrl}
        overrideOnClick={() => setPhotoActionBarVisible(true)}
        register={childRegistrationFormRegister}
        onValueChange={(imageString: string) =>
          setChildRegistrationFormValue('registrationForm', imageString)
        }
      ></ImageInput>
      <div className={'pt-4'}>
        <Typography
          weight="bold"
          type={'body'}
          color={'textMid'}
          text={
            'Did the caregiver give permission for their child to be photographed?'
          }
        ></Typography>
        <Typography
          type={'help'}
          color={'textLight'}
          text={'Optional'}
        ></Typography>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.PhotoPermissions,
              'Photo Permissions'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View photo permissions'}
          underline={true}
          type="help"
          color={'primary'}
        />
        <div>
          <div className="mt-4">
            <ButtonGroup
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) => {
                setChildRegistrationFormValue(
                  'childPhotoConsentAccepted',
                  value as boolean
                );
                setPhotoConsent(value as boolean);
              }}
              selectedOptions={photoConsent}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
              multiple={false}
            />
          </div>
        </div>
      </div>
      <div className={'pt-4'}>
        <Typography
          weight="bold"
          type={'body'}
          color={'textMid'}
          text={
            'Confirm that the caregiver accepted the following agreements by checking the boxes below:'
          }
        ></Typography>
      </div>
      <Alert
        className={'mt-4'}
        type={'info'}
        message={
          'Caregivers must confirm these 4 agreements or we cannot provide SmartStart services.'
        }
      ></Alert>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'personalInformationAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('personalInformationAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Personal information agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.PersonalInformationAgreement,
              'Personal information'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'consentAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('consentAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Consent agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.ConsentAgreement,
              'Consent Agreement'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'commitmentAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('commitmentAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Commitment agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.CommitmentAgreement,
              'Caregiver Commitments'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'indemnityAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('indemnityAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Indemnity agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.IndemnityAgreement,
              'Indemnity Agreement'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <Divider></Divider>
      <div className={'py-4'}>
        <Button
          onClick={handleFormSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isValid}
        >
          {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
          <Typography type="h6" className="ml-2" text="Next" color="white" />
        </Button>
      </div>
    </div>
  );
};

const CaregiverForm: React.FC<any> = ({
  childRegistrationFormRegister,
  displayArticle,
  checkAcceptance,
  handleFormSubmit,
  isValid,
  setChildRegistrationFormValue,
  setPhotoConsent,
  photoConsent,
}) => {
  return (
    <div className={'w-full p-4'}>
      <Typography
        type="h1"
        color="primary"
        text="Consent, indemnity, and photo permissions"
      />

      <Typography
        type="unspecified"
        color="textDark"
        text="Check the boxes below to confirm that you agree with the following:"
      />

      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'personalInformationAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('personalInformationAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Personal information agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.PersonalInformationAgreement,
              'Personal information'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'consentAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('consentAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Consent agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.ConsentAgreement,
              'Consent Agreement'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between pt-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'commitmentAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('commitmentAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Commitment agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.CommitmentAgreement,
              'Caregiver Commitments'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>
      <div className={'flex flex-row items-center justify-between py-4'}>
        <div className={styles.checkboxWrapper}>
          <Checkbox<ChildRegistrationFormModel>
            register={childRegistrationFormRegister}
            nameProp={'indemnityAgreementAccepted'}
            checkboxColor={'secondary'}
            onCheckboxChange={(change) =>
              checkAcceptance('indemnityAgreementAccepted', change)
            }
          ></Checkbox>
          <Typography
            text={'Indemnity agreement'}
            type="help"
            color={'textMid'}
          />
        </div>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.IndemnityAgreement,
              'Indemnity Agreement'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View'}
          underline={true}
          type="help"
          color={'primary'}
        />
      </div>

      <div className={'pt-4'}>
        <Typography
          weight="bold"
          type={'body'}
          color={'textMid'}
          text={`Do you give permission for the child to be photographed?`}
        ></Typography>
        <Typography
          onClick={() => {
            displayArticle(
              ContentConsentTypeEnum.PhotoPermissions,
              'Photo Permissions'
            );
          }}
          className={'cursor-pointer pt-1'}
          text={'View photo permissions'}
          underline={true}
          type="help"
          color={'primary'}
        />
        <div>
          <div className="mt-4">
            <ButtonGroup
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) => {
                setChildRegistrationFormValue(
                  'childPhotoConsentAccepted',
                  value as boolean
                );
                setPhotoConsent(value as boolean);
              }}
              selectedOptions={photoConsent}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
              multiple={false}
            />
          </div>
        </div>
      </div>

      <Divider></Divider>
      <div className={'py-4'}>
        <Button
          onClick={handleFormSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isValid}
        >
          {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
          <Typography type="h6" className="ml-2" text="Next" color="white" />
        </Button>
      </div>
    </div>
  );
};
