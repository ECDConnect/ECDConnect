import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  CheckboxChange,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Path, useForm } from 'react-hook-form';
import Article from '../../../../components/article/article';
import {
  ChildRegistrationFormModel,
  getChildRegistrationFormSchema,
} from '@schemas/child/child-registration/child-registration-form';
import { ChildRegistrationFormProps } from './child-registration-form.types';

const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const ChildRegistrationForm: React.FC<ChildRegistrationFormProps> = ({
  variation,
  onSubmit,
  childRegisterForm,
}) => {
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>(ContentConsentTypeEnum.PhotoPermissions);
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [articleTitle, setArticleTitle] = useState<string>();
  const [photoConsent, setPhotoConsent] = useState<boolean>();

  const {
    formState: childRegistrationFormState,
    getValues: getChildRegistrationFormValues,
    setValue: setChildRegistrationFormValue,
    reset: resetChildRegistrationFormValue,
    register: childRegistrationFormRegister,
    trigger,
    watch,
  } = useForm<ChildRegistrationFormModel>({
    resolver: yupResolver(getChildRegistrationFormSchema()),
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

  return (
    <div className={'flex h-full flex-1 flex-col overflow-scroll bg-white p-4'}>
      <Typography type="h2" color="primary" text="Agreements" />
      {variation === 'practitioner' && (
        <Typography
          type="h4"
          color="textMid"
          text="Give the phone to the caregiver and ask them if they accept the agreements below"
        />
      )}
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        type="h4"
        color="textDark"
        text="Check to confirm that you agree with the following:"
      />
      <div className="mt-4 flex flex-row items-center justify-between">
        <Checkbox<ChildRegistrationFormModel>
          register={childRegistrationFormRegister}
          nameProp={'personalInformationAgreementAccepted'}
          checkboxColor={'textLight'}
          onCheckboxChange={(change) =>
            checkAcceptance('personalInformationAgreementAccepted', change)
          }
          description={'Personal information agreement'}
        />
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
          color={'quatenary'}
        />
      </div>
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        weight="bold"
        type="h4"
        color="textDark"
        text="Do you give permission for the child to be photographed?"
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
        color={'quatenary'}
      />
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
        className={'my-4 w-full'}
        multiple={false}
      />
      <Button
        onClick={handleFormSubmit}
        className="mt-auto w-full"
        size="small"
        color="quatenary"
        textColor="white"
        type="filled"
        disabled={!isValid}
        icon="ArrowCircleRightIcon"
        text="Next"
      />
      <Article
        consentEnumType={contentConsentTypeEnum}
        visible={presentArticle}
        title={articleTitle}
        onClose={() => setPresentArticle(false)}
      />
    </div>
  );
};
