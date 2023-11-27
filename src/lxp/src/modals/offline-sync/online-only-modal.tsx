import React from 'react';
import { ActionModal, renderIcon } from '@ecdlink/ui';

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
      customIcon={
        <div className="rounded-full">
          {renderIcon('ExclamationIcon', 'text-alertMain w-24 h-24')}
        </div>
      }
      iconColor="alertMain"
      iconBorderColor="alertBg"
      iconClassName="h-24 w-24 text-errorMain"
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
