import { ActionModal } from '@ecdlink/ui';
import { ReactComponent as IconRobot } from '@/assets/iconRobot.svg';
import { useSessionStorage, useSnackbar } from '@ecdlink/core';

interface CaregiverMultipleChildrenModalProps {
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export const caregiverMultipleChildrenModalCountKey = 'childrenCount';

export const CaregiverMultipleChildrenModal = ({
  title,
  onSubmit,
  onCancel,
}: CaregiverMultipleChildrenModalProps) => {
  const [value, setValue] = useSessionStorage(
    caregiverMultipleChildrenModalCountKey,
    '0'
  );

  const { showMessage } = useSnackbar();

  const onExit = () => {
    const childrenCount = Number(value) + 1;
    showMessage({
      message: `${childrenCount} ${
        Number(childrenCount) > 1 ? 'children' : 'child'
      } added!`,
      type: 'success',
    });
    setValue('0');
  };

  return (
    <ActionModal
      customIcon={<IconRobot className="mb-2" />}
      title={title}
      detailText="Would you like to register another child?"
      actionButtons={[
        {
          colour: 'primary',
          text: 'Yes, register another child',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CheckCircleIcon',
          onClick: () => {
            setValue(`${Number(value) + 1}`);
            onSubmit();
          },
        },
        {
          colour: 'primary',
          text: 'No, exit',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'XCircleIcon',
          onClick: () => {
            onExit();
            onCancel();
          },
        },
      ]}
    />
  );
};
