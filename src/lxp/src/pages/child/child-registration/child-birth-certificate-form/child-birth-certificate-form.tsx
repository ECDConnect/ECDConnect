import { FormComponentProps } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  Checkbox,
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
import { useForm, useWatch } from 'react-hook-form';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import {
  BirthDocumentationType,
  ChildBirthCertificateFormModel,
  childBirthCertificateFormSchema,
} from '../../../../schemas/child/child-registration/child-birth-certificate-form';
import { ChildInformationFormModel } from '../../../../schemas/child/child-registration/child-information-form';
import * as styles from './child-birth-certificate-form.styles';

interface ChildChildBirthCertificateFormProps
  extends FormComponentProps<ChildBirthCertificateFormModel> {
  childBirthCertificateForm?: ChildBirthCertificateFormModel;
  childInformation?: ChildInformationFormModel;
  isSingleForm?: boolean;
}

export const ChildBirthCertificateForm: React.FC<ChildChildBirthCertificateFormProps> = ({
  onSubmit,
  childBirthCertificateForm,
  childInformation,
  isSingleForm = false,
}) => {
  const [hasUploadedDocument, setHasUploadedDocument] = useState<boolean>(false);
  const [hasChildDocumentation, setHasChildDocumentation] = useState<boolean>(true);
  const [selectedBirthDocumentType, setSelectedBirthDocumentType] =
    useState<BirthDocumentationType>();
  const [childName, setChildName] = useState<string>(childInformation?.firstname ?? 'Child');
  const [childBirthDocumentPhotoUrl, setChildBirthDocumentPhotoUrl] = useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] = useState<boolean>(false);
  const [displayPhotoDeleteWarning, setDisplayPhotoDeleteWarning] = useState<boolean>(false);

  const {
    formState: childBirthCertificateFormState,
    getValues: getChildBirthCertificateFormValues,
    setValue: setChildBirthCertificateFormValue,
    reset: resetChildBirthCertificateFormValue,
    register: childBirthCertificateFormRegister,
    trigger: triggerChildBirthCertificateForm,
    control: childBirthCertificateFromControl,
  } = useForm<ChildBirthCertificateFormModel>({
    resolver: yupResolver(childBirthCertificateFormSchema),
    mode: 'all',
  });
  const { isValid } = childBirthCertificateFormState;

  const { birthCertificateImage, birthCertificateType } = useWatch({
    control: childBirthCertificateFromControl,
  });

  useEffect(() => {
    if (childBirthCertificateForm) {
      resetChildBirthCertificateFormValue(childBirthCertificateForm);
      setChildName(childBirthCertificateForm?.childname ?? 'Child');
      setChildBirthDocumentPhotoUrl(childBirthCertificateForm.birthCertificateImage);
      setSelectedBirthDocumentType(childBirthCertificateForm.birthCertificateType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childBirthCertificateForm]);

  useEffect(() => {
    if (getChildBirthCertificateFormValues().hasChildDocumentation === undefined) {
      setChildBirthCertificateFormValue('hasChildDocumentation', true, { shouldValidate: true });
      triggerChildBirthCertificateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const birthDocumentationTypeOptions: ButtonGroupOption<BirthDocumentationType>[] = [
    { text: 'Birth certificate', value: 'birthCertificate' },
    { text: 'Clinic card', value: 'clinicCard' },
  ];

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildBirthCertificateFormValues());
    }
  };

  const acceptedFormats = ['jpg'];

  const toggleHasChildDocumentation = () => {
    const currentHasChildDocumentation = hasChildDocumentation;
    setHasChildDocumentation(!currentHasChildDocumentation);
    setChildBirthCertificateFormValue('hasChildDocumentation', !currentHasChildDocumentation);
    setChildBirthCertificateFormValue('birthCertificateImage', '');
    setChildBirthDocumentPhotoUrl('');
    triggerChildBirthCertificateForm();
  };

  const setPhotoUrl = (imageUrl: string) => {
    setChildBirthCertificateFormValue('birthCertificateImage', imageUrl);

    setChildBirthDocumentPhotoUrl(imageUrl);
    triggerChildBirthCertificateForm();
    setPhotoActionBarVisible(false);
  };

  const enableDeletePhotoWarning = () => {
    setDisplayPhotoDeleteWarning(true);
    setPhotoActionBarVisible(false);
  };

  const closeDeletePhotoWarning = () => {
    setDisplayPhotoDeleteWarning(false);
    setPhotoActionBarVisible(true);
  };

  const deleteBirthDocumentPhoto = () => {
    setChildBirthCertificateFormValue('birthCertificateImage', '');
    setChildBirthDocumentPhotoUrl('');
    setDisplayPhotoDeleteWarning(false);
    setPhotoActionBarVisible(true);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Typography type={'h1'} text={childName} color={'primary'} />
        <Typography type={'h2'} text={'Documentation'} color={'textMid'} />
        {hasChildDocumentation && (
          <div>
            <div className={'pt-3'}>
              <Typography
                className={'pb-2'}
                weight="bold"
                type={'body'}
                color={'textMid'}
                text={'Choose a document you want to upload:'}
              ></Typography>
              <div>
                <div>
                  <ButtonGroup
                    options={birthDocumentationTypeOptions}
                    onOptionSelected={(
                      value: BirthDocumentationType | BirthDocumentationType[]
                    ) => {
                      setChildBirthCertificateFormValue(
                        'birthCertificateType',
                        value as BirthDocumentationType
                      );
                      setSelectedBirthDocumentType(value as BirthDocumentationType);
                    }}
                    selectedOptions={selectedBirthDocumentType}
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
            <ImageInput<ChildBirthCertificateFormModel>
              acceptedFormats={acceptedFormats}
              label={`Take a photo of ${childName}’s ${
                birthCertificateType === 'clinicCard' ? 'clinic card' : 'birth certificate'
              }`}
              nameProp="birthCertificateImage"
              icon="CameraIcon"
              className={'py-4'}
              currentImageString={childBirthDocumentPhotoUrl}
              register={childBirthCertificateFormRegister}
              overrideOnClick={() => setPhotoActionBarVisible(true)}
              onValueChange={(imageString: string) => {
                setChildBirthCertificateFormValue('birthCertificateImage', imageString);
                setHasUploadedDocument(true);
                triggerChildBirthCertificateForm();
              }}
            ></ImageInput>
            {!hasUploadedDocument && (
              <div className={'w-max'}>
                <Typography
                  onClick={() => {
                    toggleHasChildDocumentation();
                  }}
                  className={'cursor-pointer pb-4'}
                  text={`I do not have ${childName}’s documents.`}
                  underline={true}
                  type="help"
                  color={'primary'}
                />
              </div>
            )}
          </div>
        )}
        {!hasChildDocumentation && (
          <div className={'pt-3'}>
            <Typography
              className={'pb-2'}
              weight="bold"
              type={'body'}
              color={'textMid'}
              text={'Please confirm:'}
            ></Typography>
            <div className={styles.checkboxWrapper}>
              <Checkbox<ChildBirthCertificateFormModel>
                register={childBirthCertificateFormRegister}
                nameProp={'acceptChildDocumentationDeclaration'}
                checkboxColor={'secondary'}
                onCheckboxChange={(change) =>
                  setChildBirthCertificateFormValue(
                    'acceptChildDocumentationDeclaration',
                    change.checked
                  )
                }
              ></Checkbox>
              <Typography
                text={`I do not have a copy of ${childName}’s birth certificate or clinic card. I declare that all information provided about ${childName} is accurate.`}
                type="help"
                color={'textMid'}
              />
            </div>
            <Alert
              className={'mt-5'}
              title={`If you can get ${childName}’s documents in future, you are required to upload them as soon as possible.`}
              type={'info'}
            />
            <div className={'w-max'}>
              <Typography
                onClick={() => {
                  toggleHasChildDocumentation();
                }}
                className={'cursor-pointer py-4'}
                text={`I have ${childName}’s documents.`}
                underline={true}
                type="help"
                color={'primary'}
              />
            </div>
          </div>
        )}
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
            {renderIcon(
              isSingleForm ? 'SaveIcon' : 'ArrowCircleRightIcon',
              classNames('h-5 w-5 text-white')
            )}
            <Typography
              type="h6"
              className="ml-2"
              text={isSingleForm ? 'Save' : 'Next'}
              color="white"
            />
          </Button>
        </div>
      </div>
      <Dialog visible={photoActionBarVisible} position={DialogPosition.Bottom} stretch>
        <div className={'p-4'}>
          <PhotoPrompt
            title={birthCertificateType === 'clinicCard' ? 'Clinic card' : 'Birth certificate'}
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
            onDelete={
              childBirthCertificateForm?.birthCertificateImage || birthCertificateImage
                ? enableDeletePhotoWarning
                : undefined
            }
          ></PhotoPrompt>
        </div>
      </Dialog>
      <Dialog
        className={'px-4 mb-16'}
        stretch
        visible={displayPhotoDeleteWarning}
        position={DialogPosition.Bottom}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Delete uploaded photo of ${childName}’s ${
            birthCertificateType === 'clinicCard' ? 'clinic card' : 'birth certificate'
          }?`}
          detailText={'If you continue, the photo you have added will be deleted.'}
          actionButtons={[
            {
              text: 'Delete photo',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => deleteBirthDocumentPhoto(),
              leadingIcon: 'TrashIcon',
            },
            {
              text: 'Continue Editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => closeDeletePhotoWarning(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
};
