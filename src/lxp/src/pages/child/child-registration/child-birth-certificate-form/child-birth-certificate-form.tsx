import { FormComponentProps } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  Checkbox,
  classNames,
  Dialog,
  DialogPosition,
  Divider,
  Dropdown,
  DropDownOption,
  IMAGE_WIDTH,
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
} from '@schemas/child/child-registration/child-birth-certificate-form';
import { ChildInformationFormModel } from '@schemas/child/child-registration/child-information-form';
import * as styles from './child-birth-certificate-form.styles';

interface ChildChildBirthCertificateFormProps
  extends FormComponentProps<ChildBirthCertificateFormModel> {
  childBirthCertificateForm?: ChildBirthCertificateFormModel;
  childInformation?: ChildInformationFormModel;
  isSingleForm?: boolean;
  isLoading?: boolean;
}

export const ChildBirthCertificateForm: React.FC<
  ChildChildBirthCertificateFormProps
> = ({
  onSubmit,
  childBirthCertificateForm,
  childInformation,
  isSingleForm = false,
  isLoading = false,
}) => {
  const [hasChildDocumentation, setHasChildDocumentation] =
    useState<boolean>(true);
  const [selectedBirthDocumentType, setSelectedBirthDocumentType] =
    useState<BirthDocumentationType>();
  const [childName, setChildName] = useState<string>(
    childInformation?.firstname ?? 'Child'
  );
  const [childBirthDocumentPhotoUrl, setChildBirthDocumentPhotoUrl] =
    useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [displayPhotoDeleteWarning, setDisplayPhotoDeleteWarning] =
    useState<boolean>(false);

  const {
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

  const {
    birthCertificateImage,
    birthCertificateType,
    acceptChildDocumentationDeclaration,
  } = useWatch({
    control: childBirthCertificateFromControl,
  });
  const hasBirthCertificateorClinicCard =
    birthCertificateType === 'birthCertificate' ||
    birthCertificateType === 'clinicCard';
  const hasNoDocuments = birthCertificateType === 'noDocument';

  useEffect(() => {
    if (childBirthCertificateForm) {
      resetChildBirthCertificateFormValue(childBirthCertificateForm);
      setChildName(childBirthCertificateForm?.childname ?? 'Child');
      setChildBirthDocumentPhotoUrl(
        childBirthCertificateForm.birthCertificateImage
      );
      setSelectedBirthDocumentType(
        childBirthCertificateForm.birthCertificateType
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childBirthCertificateForm]);

  useEffect(() => {
    if (
      getChildBirthCertificateFormValues().hasChildDocumentation === undefined
    ) {
      setChildBirthCertificateFormValue('hasChildDocumentation', true, {
        shouldValidate: true,
      });
      triggerChildBirthCertificateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const birthDocumentationDropdownOptions: DropDownOption<BirthDocumentationType>[] =
    [
      { label: 'Birth certificate', value: 'birthCertificate' },
      { label: 'Clinic card', value: 'clinicCard' },
      { label: 'Do not have document for child', value: 'noDocument' },
    ];

  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit(getChildBirthCertificateFormValues());
    }
  };

  const acceptedFormats = ['jpg'];

  const toggleHasChildDocumentation = () => {
    const currentHasChildDocumentation = hasChildDocumentation;
    setHasChildDocumentation(!currentHasChildDocumentation);
    setChildBirthCertificateFormValue(
      'hasChildDocumentation',
      !currentHasChildDocumentation
    );
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
  };

  const deleteBirthDocumentPhoto = () => {
    setChildBirthCertificateFormValue('birthCertificateImage', '');
    setChildBirthDocumentPhotoUrl('');
    toggleHasChildDocumentation();
    setDisplayPhotoDeleteWarning(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Typography type={'h1'} text={childName} color={'primary'} />
        <Typography type={'h2'} text={'Documentation'} color={'textMid'} />
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
              <Dropdown
                placeholder="Tap to choose a document"
                list={birthDocumentationDropdownOptions}
                selectedValue={selectedBirthDocumentType}
                onChange={(
                  value: BirthDocumentationType | BirthDocumentationType[]
                ) => {
                  setChildBirthCertificateFormValue(
                    'birthCertificateType',
                    value as BirthDocumentationType
                  );
                  setSelectedBirthDocumentType(value as BirthDocumentationType);
                  toggleHasChildDocumentation();
                }}
              />
            </div>
          </div>
          {hasBirthCertificateorClinicCard && (
            <ImageInput<ChildBirthCertificateFormModel>
              acceptedFormats={acceptedFormats}
              resolutionLimit={IMAGE_WIDTH}
              label={`Take a photo of ${childName}’s ${
                birthCertificateType === 'clinicCard'
                  ? 'clinic card'
                  : 'birth certificate'
              }`}
              nameProp="birthCertificateImage"
              icon="CameraIcon"
              className={'py-4'}
              currentImageString={childBirthDocumentPhotoUrl}
              register={childBirthCertificateFormRegister}
              overrideOnClick={() => setPhotoActionBarVisible(true)}
              onValueChange={(imageString: string) => {
                setChildBirthCertificateFormValue(
                  'birthCertificateImage',
                  imageString
                );
                triggerChildBirthCertificateForm();
              }}
            ></ImageInput>
          )}
        </div>
        {hasNoDocuments && (
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
            isLoading={isLoading}
            disabled={
              (!birthCertificateImage &&
                !acceptChildDocumentationDeclaration) ||
              isLoading
            }
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
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Bottom}
        stretch
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title={
              birthCertificateType === 'clinicCard'
                ? 'Clinic card'
                : 'Birth certificate'
            }
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
            onDelete={
              childBirthCertificateForm?.birthCertificateImage ||
              birthCertificateImage
                ? enableDeletePhotoWarning
                : undefined
            }
          ></PhotoPrompt>
        </div>
      </Dialog>
      <Dialog
        className={'mb-16 px-4'}
        stretch
        visible={displayPhotoDeleteWarning}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Delete uploaded photo of ${childName}’s ${
            birthCertificateType === 'clinicCard'
              ? 'clinic card'
              : 'birth certificate'
          }?`}
          detailText={
            'If you continue, the photo you have added will be deleted.'
          }
          actionButtons={[
            {
              text: 'Delete photo',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: deleteBirthDocumentPhoto,
              leadingIcon: 'TrashIcon',
            },
            {
              text: 'Continue Editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: closeDeletePhotoWarning,
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
};
