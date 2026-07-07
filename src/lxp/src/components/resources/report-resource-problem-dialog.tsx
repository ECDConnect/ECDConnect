import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { resourcesThunkActions } from '@/store/resources';
import {
  BannerWrapper,
  Button,
  FormInput,
  Radio,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';
import {
  RESOURCE_PROBLEM_TYPES,
  ResourceProblemType,
} from './resource-problem-report.types';

interface ReportResourceProblemDialogProps {
  contentId: number;
  dataFree: boolean | string | undefined;
  link: string | undefined;
  onClose: () => void;
  onSaveSuccess: () => void;
  onSaveError: () => void;
}

export const ReportResourceProblemDialog: React.FC<
  ReportResourceProblemDialogProps
> = ({ contentId, dataFree, link, onClose, onSaveSuccess, onSaveError }) => {
  const appDispatch = useAppDispatch();
  const [problemType, setProblemType] = useState<ResourceProblemType | ''>('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDataFree = dataFree === 'true' || dataFree === true;
  const disableSave = !problemType || isLoading;

  const handleSave = async () => {
    if (!problemType) {
      return;
    }

    try {
      setIsLoading(true);
      await appDispatch(
        resourcesThunkActions.reportResourceProblem({
          contentId,
          problemType,
          additionalDetails: additionalDetails.trim() || undefined,
          dataFreeAtReport: isDataFree ? 'true' : 'false',
          linkAtReport: link ?? '',
        })
      ).unwrap();
      onSaveSuccess();
    } catch (error) {
      console.error('Failed to reportResourceProblem:', error);
      onSaveError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      className="h-full"
      color="primary"
      title="Report a problem"
      onClose={onClose}
    >
      <div className="flex h-full flex-col overflow-y-scroll bg-white p-4">
        <Typography type="h2" color="textDark" text="Report a problem" />
        <fieldset className="my-4 flex flex-col gap-2">
          <Typography
            type="h4"
            text="What's wrong with this resource?"
            color="textDark"
          />
          {RESOURCE_PROBLEM_TYPES.map((item) => (
            <Radio
              variant="slim"
              key={item}
              description={item}
              value={item}
              checked={problemType === item}
              onChange={() => setProblemType(item)}
            />
          ))}
        </fieldset>
        <FormInput
          label="Tell us more"
          hint="Optional"
          textInputType="textarea"
          placeholder="Add text..."
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e?.target?.value)}
        />
        <div className="w-full py-4">
          <Button
            isLoading={isLoading}
            type="filled"
            color="quatenary"
            className="mb-20 w-full"
            disabled={disableSave}
            onClick={handleSave}
          >
            {renderIcon('SaveIcon', 'w-5 h-5 text-white mr-1')}
            <Typography type="help" color="white" text="Save" />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
