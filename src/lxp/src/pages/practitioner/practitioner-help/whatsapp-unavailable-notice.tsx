import { ActionModal, renderIcon } from '@ecdlink/ui';

export const HELP_EMAIL = 'help@ecdconnect.co.za';

interface WhatsAppUnavailableNoticeProps {
  onSendEmail: () => void;
  onClose: () => void;
}

export const WhatsAppUnavailableNotice: React.FC<
  WhatsAppUnavailableNoticeProps
> = ({ onSendEmail, onClose }) => {
  return (
    <ActionModal
      className="mx-4"
      customIcon={
        <div className="bg-alertMain mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          {renderIcon('ExclamationIcon', 'h-6 w-6 text-white')}
        </div>
      }
      title="Our WhatsApp is not working"
      detailText={`We are fixing it. For now, please message us on Facebook or email us at ${HELP_EMAIL}`}
      actionButtons={[
        {
          text: 'Send email',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          leadingIcon: 'PaperAirplaneIcon',
          onClick: onSendEmail,
        },
        {
          text: 'Close',
          textColour: 'quatenary',
          colour: 'quatenary',
          type: 'outlined',
          leadingIcon: 'XIcon',
          onClick: onClose,
        },
      ]}
    />
  );
};
