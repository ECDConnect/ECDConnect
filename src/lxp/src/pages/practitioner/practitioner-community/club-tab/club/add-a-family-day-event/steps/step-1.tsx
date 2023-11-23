import { Alert, Dropdown, FormInput, Typography } from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useState } from 'react';

export const Step1 = ({
  termConfig,
  setIsEnabledButton,
  setStep1,
}: AddMeetingProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptionOther, setSelectedOptionOther] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const options = [
    'Open Day',
    'Play Day',
    'Story Day',
    'End of Year Celebration',
    'Other',
  ].map((item) => ({ label: item, value: item }));

  useEffect(() => {
    if (
      ((selectedOption && selectedOption !== 'Other') ||
        (selectedOption === 'Other' && selectedOptionOther)) &&
      description
    ) {
      setStep1?.({
        meetingType:
          selectedOption === 'Other' ? selectedOptionOther : selectedOption,
        meetingNotes: description,
      });
      setIsEnabledButton(true);
    } else {
      setIsEnabledButton(false);
    }
  }, [
    description,
    selectedOption,
    selectedOptionOther,
    setIsEnabledButton,
    setStep1,
  ]);

  if (!termConfig) {
    return (
      <Alert
        type="error"
        title="It's only possible to add a family day event from January to October."
      />
    );
  }

  return (
    <>
      <Typography
        type="h2"
        text={`Add a family day event for ${termConfig?.term}`}
      />
      <Typography
        className="mb-5"
        type="body"
        color="textMid"
        text={`${termConfig?.initialMonth} to ${
          termConfig?.lastMonth
        } ${new Date().getFullYear()}`}
      />
      <Alert
        className="mb-4"
        type="info"
        title="You can submit one event per term."
      />
      <Dropdown<string>
        className="mb-4"
        label="What type of event did you hold?"
        list={options}
        selectedValue={selectedOption}
        placeholder="Tap to choose event type"
        onChange={setSelectedOption}
      />
      {selectedOption === 'Other' && (
        <FormInput
          label="Please describe the event type"
          hint="Give your event a short name (one or two words)"
          value={selectedOptionOther}
          onChange={(e) => setSelectedOptionOther(e.target.value)}
        />
      )}
      <FormInput
        label="Add a short description of the event"
        placeholder="e.g. Sharing activity information with caregivers."
        textInputType="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </>
  );
};
