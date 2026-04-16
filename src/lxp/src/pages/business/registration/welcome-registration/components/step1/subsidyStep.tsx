import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Radio,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface SubsidyStepProps {
  onNext: () => void;
  setValue: UseFormSetValue<any>;
  subsidy: string | undefined;
  registration: string | undefined;
}

const yesNoOptions = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
  { text: 'Not sure', value: 'unsure' },
];

const registrationOptions = [
  { id: '1', text: `Yes - fully registered` },
  { id: '2', text: `Yes - conditionally registered` },
  { id: '3', text: `No - I started the process of registering` },
  { id: '4', text: `No - I have not started the process of registering` },
  { id: '5', text: `I'm not sure` },
];

export const SubsidyStep: React.FC<SubsidyStepProps> = ({
  onNext,
  setValue,
  subsidy,
  registration,
}) => {
  const [selectedOption, setSelectedOption] = useState(registration ?? '');

  useEffect(() => {
    // Only clear the registration answer when the registration question is hidden
    // (subsidy = 'true'). For 'false' and 'unsure' the question is shown, so the
    // existing answer should be preserved.
    if (subsidy === 'true') {
      setSelectedOption('');
      setValue('registration', undefined);
    }
  }, [subsidy, setValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    setValue('registration', e.target.value);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type={'h1'}
        text={`Registration information`}
        className={'text-sm font-bold'}
        color={'textDark'}
      />
      <Typography
        type={'h4'}
        text={`Are you receiving a subsidy from the DBE?`}
        className={'mt-3 mb-3 font-semibold'}
        color={'textDark'}
      />
      <ButtonGroup<string>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={yesNoOptions}
        selectedOptions={subsidy}
        onOptionSelected={(option: string | string[]) => {
          setValue('subsidy', option);
        }}
        notSelectedColor="secondaryAccent2"
        textColor="secondary"
      />
      <div className="mt-2">
        {(subsidy === 'false' || subsidy === 'unsure') && (
          <>
            <Typography
              type={'h4'}
              text={`Are you registered with the DBE?`}
              className={'mt-3 mb-3 font-semibold'}
              color={'textDark'}
            />
            <fieldset className="flex flex-col gap-2">
              {registrationOptions.map((option) => (
                <Radio
                  key={option.id}
                  id={option.id}
                  value={option.text}
                  description={option.text}
                  checked={selectedOption === option.text}
                  onChange={handleChange}
                  variant="slim"
                />
              ))}
            </fieldset>
          </>
        )}
      </div>
      <Button
        className="mt-auto w-full"
        size="normal"
        type="filled"
        color="quatenary"
        text="Next"
        textColor="white"
        icon="ArrowCircleRightIcon"
        disabled={
          subsidy === undefined ||
          (subsidy === 'false' && selectedOption === '')
        }
        onClick={onNext}
      />
    </div>
  );
};
