import { Alert, Divider, FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { ChangeEvent, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';

const MOCKED_DATA = {
  followUp: {
    text: 'Use the daily routine marker etc.',
    date: '6 December 2021',
  },
};
export const DiscussionNotes = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = `What next steps or plans to improve did you discuss with {client}?`;
  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Discussion notes';
  // TODO: add integration (15.1.4)
  const isFollowUp = false;

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);

    if (value !== '') {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  };

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Divider dividerType="dashed" className="my-3" />
      <FormInput
        label={replaceBraces(question, name)}
        subLabel={`These notes will be shared with client.`}
        textInputType="textarea"
        className="mb-4"
        value={answer}
        onChange={onChange}
      />

      {isFollowUp ? (
        <div className="bg-uiBg rounded-15 p-4">
          <Typography
            type="h3"
            text="Your discussion notes from the first site visit"
            color="textDark"
          />
          <Typography
            type="markdown"
            className="text-14"
            text={MOCKED_DATA.followUp.date}
            color="textDark"
          />
          <Typography
            type="body"
            text={MOCKED_DATA.followUp.text}
            color="textMid"
            className="mt-4"
          />
        </div>
      ) : (
        <>
          <Typography
            type="h3"
            text={`Questions to ask client:`}
            color="textDark"
            className="mb-4"
          />
          <ul className="text-textMid ml-5" style={{ listStyleType: 'disc' }}>
            {[
              'How is the programme going? What are you enjoying? Is there anything you are finding difficult or anything I can help with?',
              'Do you host parent/caregiver meetings? if no, why not? If yes, when was the last one and how was it? Did you use your get set go flyers?',
              'Do you attend club meetings? If no, why not? If yes, when was the last one and how was it?',
            ].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {!!answer && (
        <Alert
          className="mt-4"
          type="success"
          title="All steps complete - your signature has been added."
        />
      )}
    </div>
  );
};
