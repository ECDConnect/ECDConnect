import {
  Button,
  FormInput,
  SearchDropDownOption,
  Typography,
  renderIcon,
} from '@ecdlink/ui';

interface Step2Props {
  healthCareWorkers?: SearchDropDownOption<string>[];
  handleNextButton?: () => void;
  setPositiveStory?: (item: string) => void;
  positiveStory?: string;
  setReportIssue?: (item: string) => void;
  reportissue?: string;
}
export const Step2: React.FC<Step2Props> = ({
  handleNextButton,
  setPositiveStory,
  positiveStory,
  setReportIssue,
  reportissue,
}) => {
  const disableButton = !positiveStory || !reportissue;
  return (
    <div>
      <Typography type="h3" text={'In-field & supervision'} className="mb-4" />
      <FormInput
        className="my-4 w-full"
        label={'Please share a positive story from the field *'}
        onChange={(e) => setPositiveStory(e.target.value)}
        textInputType="textarea"
        value={positiveStory}
        placeholder={'Add text...'}
        isAdminPortalField
      />
      <FormInput
        className="my-4 w-full"
        label={
          'Is there anything you would like to report to GGC? Please provide detail. *'
        }
        onChange={(e) => setReportIssue(e.target.value)}
        textInputType="textarea"
        value={reportissue}
        placeholder={'Add text...'}
        isAdminPortalField
      />
      <div>
        <Button
          type="filled"
          color="secondary"
          className={'mt-1 mb-2 w-full'}
          onClick={handleNextButton}
          disabled={disableButton}
        >
          {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
          <Typography type={'help'} text={'Next'} color={'white'} />
        </Button>
      </div>
    </div>
  );
};
