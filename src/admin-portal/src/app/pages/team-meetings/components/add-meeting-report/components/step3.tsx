import {
  Button,
  FormInput,
  LoadingSpinner,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { numberInputInvalidChars } from '../../../team-meetings-types';

interface Step3Props {
  healthCareWorkers?: SearchDropDownOption<string>[];
  handleSaveMeetingReport?: () => void;
  setParticipantsInFields?: (item: SearchDropDownOption<string>[]) => void;
  participantsInFields?: SearchDropDownOption<string>[];
  setInFieldSupportVisits?: (item: string) => void;
  inFieldSupportVisits?: string;
  loadingHCWs?: boolean;
}
export const Step3: React.FC<Step3Props> = ({
  healthCareWorkers,
  handleSaveMeetingReport,
  setParticipantsInFields,
  participantsInFields,
  setInFieldSupportVisits,
  inFieldSupportVisits,
  loadingHCWs,
}) => {
  const disableButton =
    !inFieldSupportVisits || participantsInFields?.length <= 0;
  return (
    <div>
      <Typography type="h3" text={'In-field & supervision'} className="mb-4" />
      <FormInput
        className="my-4 w-full"
        label={'How many in-field support visits have you done this month? *'}
        onChange={(e) => setInFieldSupportVisits(e.target.value)}
        textInputType="input"
        value={inFieldSupportVisits}
        placeholder={'Add a number'}
        type="number"
        isAdminPortalField
        onKeyDown={(e: any) => {
          if (numberInputInvalidChars.includes(e.key)) {
            e.preventDefault();
          }
        }}
      />
      {loadingHCWs && (
        <LoadingSpinner
          size="medium"
          spinnerColor="secondary"
          backgroundColor="uiMid"
        />
      )}
      {!loadingHCWs && (
        <div className="my-8 mr-2 flex w-full items-center gap-2">
          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1 w-full'}
            menuItemClassName={
              'w-full left-4 overflow-y-scroll bg-adminPortalBg'
            }
            overlayTopOffset={'120'}
            options={healthCareWorkers}
            selectedOptions={participantsInFields}
            onChange={setParticipantsInFields}
            placeholder={'Choose CHWs'}
            multiple={true}
            color={'secondary'}
            bgColor="adminPortalBg"
            info={{
              name: `CHWs:`,
            }}
            label="Select all CHWs you went into the field with. *"
          />
        </div>
      )}
      <div>
        <Button
          type="filled"
          color="secondary"
          className={'mt-1 mb-2 w-full'}
          onClick={handleSaveMeetingReport}
          disabled={disableButton}
        >
          {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
          <Typography type={'help'} text={'Save'} color={'white'} />
        </Button>
      </div>
    </div>
  );
};
