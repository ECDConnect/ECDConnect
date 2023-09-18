import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dropdown,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ClubAddProps } from '..';
import { useEffect, useState } from 'react';

export const Step2 = ({ setIsEnabledButton }: ClubAddProps) => {
  const [answer1, setAnswer1] = useState<boolean>();
  const [answer2, setAnswer2] = useState<number>();

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    // TODO: put it in an onChange
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Add a club" />
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text="Would you like to move any SmartStarters from a different club into the Winners club?"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) => setAnswer1(value as boolean)}
        className="mb-4"
      />
      {/* TODO: add real rule */}
      {answer1 === false && (
        <Alert
          type="warning"
          title="You must select at least 1 SmartStarter to continue!"
          list={[
            'Go back to step 1 to choose SmartStarters or select Yes above.s',
          ]}
        />
      )}
      {answer1 && (
        <>
          <FormInput
            type="number"
            label="How many SmartStarters would you like to move from a different club into the Winners club?"
            placeholder="Add a number..."
            value={answer2}
            onChange={(event) =>
              setAnswer2(
                event.target.value ? Number(event.target.value) : undefined
              )
            }
            {...(answer2 &&
              answer2 > 18 && {
                error: {
                  message:
                    'Please enter a number greater than 0 and less than 18.',
                  type: '',
                },
              })}
          />

          {answer2 && answer2 <= 18 && (
            <>
              <Typography
                className="mt-4"
                type="h4"
                text={`Choose ${answer2} SmartStarters:`}
              />
              {Array.from(Array(answer2)).map((_, index) => (
                <>
                  {/* TODO: add integration */}
                  <Dropdown
                    placeholder="Tap to search"
                    list={[]}
                    onChange={() => {}}
                  />
                </>
              ))}
            </>
          )}
          {/* TODO: add integration */}
          <Checkbox
            className="my-4"
            descriptionColor="textDark"
            description="I confirm that all SmartStarters selected have agreed to move to a new club."
          />
        </>
      )}
    </>
  );
};
