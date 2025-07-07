import React from 'react';
import { ActionModal } from '@ecdlink/ui';
import { ExclamationIcon } from '@heroicons/react/solid';

export type OnlineOnlyModalProps = {
  onSubmit: () => void;
  overrideText?: string;
};

export const OnlineOnlyModal: React.FC<OnlineOnlyModalProps> = ({
  onSubmit,
  overrideText,
}) => {
  return (
    <ActionModal
      className="bg-white"
      customIcon={<ExclamationIcon className="text-alertMain h-24 w-24" />}
      icon="ExclamationIcon"
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
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onSubmit && onSubmit(),
          leadingIcon: 'CheckCircleIcon',
        },
      ]}
    />
  );
};

export default OnlineOnlyModal;
