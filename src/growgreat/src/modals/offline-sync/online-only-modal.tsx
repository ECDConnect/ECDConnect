import React from 'react';
import { ActionModal } from '@ecdlink/ui';

export type OnlineOnlyModalProps = {
  onSubmit: () => void;
  overrideText?: string;
};

const OnlineOnlyModal: React.FC<OnlineOnlyModalProps> = ({
  onSubmit,
  overrideText,
}) => {
  return (
    <ActionModal
      icon={'ExclamationCircleIcon'}
      iconColor="alertMain"
      iconBorderColor="alertBg"
      title={
        overrideText
          ? overrideText
          : 'You need to go online to use this feature'
      }
      detailText={`Switch on your mobile data or connect to a wifi network to use this feature.`}
      actionButtons={[
        {
          text: 'Okay',
          textColour: 'white',
          colour: 'primary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'CheckCircleIcon',
        },
      ]}
    />
  );
};

export default OnlineOnlyModal;
