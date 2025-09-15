import { ActionModal, ComponentBaseProps, Typography } from '@ecdlink/ui';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';

interface CaregiverChildRegistrationModalProps extends ComponentBaseProps {
  caregiverUrl: string;
  firstName: string;
  couldCopyToClipboard: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CaregiverChildRegistrationModal: React.FC<
  CaregiverChildRegistrationModalProps
> = ({ firstName, caregiverUrl, couldCopyToClipboard, onSubmit, onCancel }) => {
  return (
    <ActionModal
      icon={couldCopyToClipboard ? 'CheckCircleIcon' : 'InformationCircleIcon'}
      iconBorderColor={couldCopyToClipboard ? 'successBg' : 'alertBg'}
      iconColor={couldCopyToClipboard ? 'successMain' : 'infoMain'}
      title={couldCopyToClipboard ? 'Link Copied!' : 'Please Copy Link'}
      detailText={`Send the link to ${firstName}'s caregiver.
        `}
      actionButtons={[
        {
          colour: 'quatenary',
          text: 'Go to WhatsApp',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleRightIcon',
          onClick: () => {
            onSubmit();
          },
        },
        {
          colour: 'quatenary',
          text: 'Close',
          textColour: 'quatenary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: () => {
            onCancel();
          },
        },
      ]}
    ></ActionModal>
  );
};
