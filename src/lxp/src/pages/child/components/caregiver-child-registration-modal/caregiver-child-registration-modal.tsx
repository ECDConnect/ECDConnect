import { ActionModal, ComponentBaseProps, Typography } from '@ecdlink/ui';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';

interface CaregiverChildRegistrationModalProps extends ComponentBaseProps {
  caregiverUrl: string;
  childDetails: Omit<ChildBasicInfoModel, 'playgroupId'>;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CaregiverChildRegistrationModal: React.FC<CaregiverChildRegistrationModalProps> = ({
  childDetails,
  caregiverUrl,
  onSubmit,
  onCancel,
}) => {
  const whatsapp = () => {
    window.open(`https://wa.me/`);
  };

  return (
    <ActionModal
      icon="CheckCircleIcon"
      iconBorderColor="successBg"
      iconColor="successMain"
      title="Link Copied"
      paragraphs={[
        `You can send this link to ${childDetails.firstName}'s caregiver by pasting it in WhatsApp or in an SMS.`,
        `You can also access this link on ${childDetails.firstName}'s profile.`,
      ]}
      actionButtons={[
        {
          colour: 'primary',
          text: 'Go to WhatsApp',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleRightIcon',
          onClick: () => {
            onSubmit();
            whatsapp();
          },
        },
        {
          colour: 'primary',
          text: 'Close',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: () => {
            onCancel();
          },
        },
      ]}
    >
      <Typography
        className="mb-2"
        onClick={async () => {
          window.prompt('Copy value from input', caregiverUrl);
        }}
        text={`<u>Click here to copy link manually</u>`}
        color="primary"
        type="unspecified"
        hasMarkup
      />
    </ActionModal>
  );
};
