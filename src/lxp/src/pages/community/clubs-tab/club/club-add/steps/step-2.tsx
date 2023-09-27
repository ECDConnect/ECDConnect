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

interface Step2Props extends ClubAddProps {
  title: string;
}

export const Step2 = ({ title, setIsEnabledButton }: Step2Props) => {
  const [
    isToMoveSmartStartersFromOtherClub,
    setIsToMoveSmartStartersFromOtherClub,
  ] = useState<boolean>();
  const [smartStartersCount, setSmartStartersCount] = useState<number>();

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
      <Typography type="h2" text={title} />
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text="Would you like to move any SmartStarters from a different club into the Winners club?"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) =>
          setIsToMoveSmartStartersFromOtherClub(value as boolean)
        }
        className="mb-4"
      />
      {/* TODO: add real rule */}
      {isToMoveSmartStartersFromOtherClub === false && (
        <Alert
          type="warning"
          title="You must select at least 1 SmartStarter to continue!"
          list={[
            'Go back to step 1 to choose SmartStarters or select Yes above.s',
          ]}
        />
      )}
      {isToMoveSmartStartersFromOtherClub && (
        <>
          <FormInput
            type="number"
            label="How many SmartStarters would you like to move from a different club into the Winners club?"
            placeholder="Add a number..."
            value={smartStartersCount}
            onChange={(event) =>
              setSmartStartersCount(
                event.target.value ? Number(event.target.value) : undefined
              )
            }
            {...(smartStartersCount &&
              smartStartersCount > 18 && {
                error: {
                  message:
                    'Please enter a number greater than 0 and less than 18.',
                  type: '',
                },
              })}
          />

          {smartStartersCount && smartStartersCount <= 18 && (
            <>
              <Typography
                className="mt-4"
                type="h4"
                text={`Choose ${smartStartersCount} SmartStarters:`}
              />
              {Array.from(Array(smartStartersCount)).map((_, index) => (
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
