import { UserDto } from '@ecdlink/core';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Dropdown,
  LoadingSpinner,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';
import { yesOrNoOptions } from '../../../team-meetings-types';

interface Step1Props {
  healthCareWorkers?: SearchDropDownOption<string>[];
  user?: UserDto;
  setOptOutHcws?: (item: SearchDropDownOption<string>[]) => void;
  optOutHcws?: SearchDropDownOption<string>[];
  clinics?: SearchDropDownOption<string>[];
  handleNextButton?: () => void;
  setClinic?: (item: string) => void;
  clinic?: string;
  loadingHCWs?: boolean;
}

export const Step1: React.FC<Step1Props> = ({
  healthCareWorkers,
  setOptOutHcws,
  optOutHcws,
  clinics,
  handleNextButton,
  setClinic,
  clinic,
  loadingHCWs,
}) => {
  const [optOutValue, setOptOutValue] = useState<boolean | boolean[]>(
    undefined
  );
  const disableButton =
    !clinic ||
    (optOutValue && optOutHcws?.length <= 0) ||
    optOutValue === undefined;

  return (
    <div className="mt-4s">
      <div className=" w-full">
        <Dropdown
          placeholder={'Click to select a clinic'}
          label={'Choose a clinic *'}
          subLabel="Please select a clinic."
          list={clinics}
          onChange={(item) => {
            setClinic(item);
          }}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
          selectedValue={clinic}
        />
      </div>
      <div className="my-4">
        <div className="space-y-4">
          <div className={'w-full'}>
            <label className={'font-body text-textDark block text-base'}>
              Have any CHWs opted out of GGC this month? *
            </label>
          </div>
        </div>

        <ButtonGroup<boolean>
          color="tertiary"
          type={ButtonGroupTypes.Button}
          options={yesOrNoOptions}
          onOptionSelected={(option: boolean | boolean[]) =>
            setOptOutValue(option)
          }
          selectedOptions={optOutValue}
          notSelectedColor="tertiaryAccent2"
          textColor="tertiary"
        />
      </div>
      {optOutValue && loadingHCWs && (
        <LoadingSpinner
          size="medium"
          spinnerColor="secondary"
          backgroundColor="uiLight"
          className="my-8"
        />
      )}
      {optOutValue && !loadingHCWs && healthCareWorkers?.length > 0 && (
        <div className="my-8 mr-2 flex w-full items-center gap-2">
          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1 w-full'}
            menuItemClassName={
              'w-full left-4 overflow-y-scroll bg-adminPortalBg'
            }
            overlayTopOffset={'120'}
            options={healthCareWorkers}
            selectedOptions={optOutHcws}
            onChange={setOptOutHcws}
            placeholder={'Choose CHWs'}
            multiple={true}
            color={'secondary'}
            bgColor="adminPortalBg"
            info={{
              name: `CHWs:`,
            }}
            label="Select all CHWs who have opted out this month. *"
            preventCloseOnClick={true}
          />
        </div>
      )}
      {healthCareWorkers?.length === 0 && optOutValue && !loadingHCWs && (
        <Alert
          className="my-4 rounded-lg"
          type="warning"
          title={`There are no HCW's for this clinic`}
        />
      )}
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
