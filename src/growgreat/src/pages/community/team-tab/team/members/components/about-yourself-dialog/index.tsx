import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';
import {
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';

interface AboutYourselfDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
}
export const AboutYourselfDialog = ({
  onClose,
  onSave,
  visible,
}: AboutYourselfDialogProps) => {
  const [value, setValue] = useState('');

  const { isLoading } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE
  );

  return (
    <Dialog
      visible={visible}
      position={DialogPosition.Bottom}
      className="overflow-auto"
    >
      <div className="flex flex-col  gap-5 rounded-3xl bg-white p-4">
        <div className="flex gap-4">
          <Typography
            type="h3"
            text="Share something about yourself in 4 or 5 words"
          />
          <button onClick={onClose}>
            {renderIcon('XIcon', 'x-6 h-6 text-textMid')}
          </button>
        </div>

        <FormInput
          placeholder="..."
          maxCharacters={value ? 125 : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          icon="SaveIcon"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          isLoading={isLoading}
          disabled={!value || value.length > 125 || isLoading}
          onClick={() => onSave(value)}
        />
      </div>
    </Dialog>
  );
};
