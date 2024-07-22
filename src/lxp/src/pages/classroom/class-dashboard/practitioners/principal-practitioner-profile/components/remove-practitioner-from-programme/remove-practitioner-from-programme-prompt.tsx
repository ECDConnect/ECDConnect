import { PractitionerDto } from '@ecdlink/core';
import { ActionModal, ComponentBaseProps } from '@ecdlink/ui';
import { staticDataSelectors } from '@/store/static-data';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

interface RemovePractitionerFromProgrammePromptProps
  extends ComponentBaseProps {
  practitioner?: PractitionerDto;
  leavingDate: Date;
  onProceed?: () => void;
  onClose?: () => void;
}

export const RemovePractitionerFromProgrammePrompt: React.FC<
  RemovePractitionerFromProgrammePromptProps
> = ({ practitioner, onProceed, className, leavingDate }) => {
  const role = useSelector(staticDataSelectors.geCoachRole);

  const date = new Date(leavingDate);

  return (
    <ActionModal
      icon={'XCircleIcon'}
      className={className}
      iconColor="errorMain"
      iconBorderColor="errorBg"
      importantText={`${
        practitioner?.user?.firstName
      } will be removed from your programme on ${format(date, 'd MMMM')} `}
      actionButtons={[
        {
          text: 'Close',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onProceed && onProceed(),
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};

export default RemovePractitionerFromProgrammePrompt;
