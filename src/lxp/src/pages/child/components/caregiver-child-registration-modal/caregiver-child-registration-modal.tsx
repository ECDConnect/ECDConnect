import { ActionModal, ComponentBaseProps, Typography } from '@ecdlink/ui';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';

interface CaregiverChildRegistrationModalProps extends ComponentBaseProps {
  caregiverUrl: string;
  childDetails: Omit<ChildBasicInfoModel, 'playgroupId'>;
  couldCopyToClipboard: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CaregiverChildRegistrationModal: React.FC<
  CaregiverChildRegistrationModalProps
> = ({
  childDetails,
  caregiverUrl,
  couldCopyToClipboard,
  onSubmit,
  onCancel,
}) => {
  return (
    <ActionModal
      icon={couldCopyToClipboard ? 'CheckCircleIcon' : 'InformationCircleIcon'}
      iconBorderColor={couldCopyToClipboard ? 'successBg' : 'alertBg'}
      iconColor={couldCopyToClipboard ? 'successMain' : 'infoMain'}
      title={couldCopyToClipboard ? 'Link Copied!' : 'Please Copy Link'}
      detailText={`
        Go to WhatsApp and send the link to ${childDetails.firstName}’s caregiver, or paste and send it in an SMS.

You can also access this link on ${childDetails.firstName}'s profile.
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
    >
      {/* <Typography
        className="mb-2"
        onClick={async () => {
          window.prompt('Copy value from input', caregiverUrl);
        }}
        text={`<u>Click here to copy link manually</u>`}
        color="primary"
        type="unspecified"
        hasMarkup
      /> */}
    </ActionModal>
  );
};
