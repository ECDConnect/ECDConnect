import { Button, FormInput, Radio, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface ChallengesStepProps {
  onSubmit: () => void;
  setValue: UseFormSetValue<any>;
}

// Static — defined outside the component so it isn't recreated on every render.
const challengeOptions = [
  { id: '1', text: `I don't know where to start` },
  { id: '2', text: `The process takes too long or is too complicated` },
  { id: '3', text: `I don't understand what requirements or documents I need` },
  { id: '4', text: `I don't have or cannot get the right documents` },
  { id: '5', text: `I cannot reach the officials who can help` },
  {
    id: '6',
    text: `I don't have the infrastructure or resources to meet requirements`,
  },
  { id: '7', text: `Other` },
];

export const ChallengesStep: React.FC<ChallengesStepProps> = ({
  onSubmit,
  setValue,
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [otherDetail, setOtherDetail] = useState('');
  const [problemDetail, setProblemDetail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    setValue('challenge', value);
    // Clear the 'Other' detail when switching away from that option.
    if (value !== 'Other') {
      setOtherDetail('');
      setValue('otherDetail', '');
    }
  };

  const canSubmit =
    selectedOption !== '' &&
    (selectedOption !== 'Other' || otherDetail.trim() !== '') &&
    problemDetail.trim() !== '';

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type={'h1'}
        text={`Challenges`}
        className={'text-sm'}
        color={'textDark'}
      />
      <Typography
        type={'h3'}
        text={`What is the biggest challenge you face with DBE registration right now?`}
        className={'mt-3 text-sm font-normal'}
        color={'textMid'}
      />
      <fieldset className="flex flex-col gap-2">
        {challengeOptions.map((option) => (
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
      {selectedOption === 'Other' && (
        <div className="py-4">
          <Typography
            type={'h3'}
            text={`Please give more detail`}
            className={'text-sm font-normal'}
            color={'textMid'}
          />
          <FormInput
            textInputType="textarea"
            placeholder="Add text..."
            value={otherDetail}
            onChange={(e) => {
              const val = e?.target?.value ?? '';
              setOtherDetail(val);
              setValue('otherDetail', val);
            }}
          />
        </div>
      )}
      <div className="py-4">
        <Typography
          type={'h3'}
          text={`What is the biggest issue you are facing when it comes to funding for your ECD programme?`}
          className={'text-sm font-normal'}
          color={'textMid'}
        />
        <FormInput
          textInputType="textarea"
          placeholder="Add text..."
          onChange={(e) => {
            const val = e?.target?.value ?? '';
            setProblemDetail(val);
            setValue('problem', val);
          }}
        />
      </div>
      <Button
        size="normal"
        className="mt-auto w-full"
        type="filled"
        color="quatenary"
        text="Save"
        textColor="white"
        icon="SaveIcon"
        disabled={!canSubmit}
        onClick={onSubmit}
      />
    </div>
  );
};
