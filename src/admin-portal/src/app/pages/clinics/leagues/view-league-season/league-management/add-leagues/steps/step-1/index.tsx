import { FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent } from 'react';

interface Step1Props {
  quantityLeagues: number;
  setQuantityLeagues: (value: number) => void;
}
export const Step1 = ({ quantityLeagues, setQuantityLeagues }: Step1Props) => {
  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = Number(event.target.value);

    if (value > 30) {
      return setQuantityLeagues(0);
    }

    setQuantityLeagues(Number(value));
  };
  return (
    <>
      <Typography
        type="h1"
        color="textDark"
        text="Step 1: Select the number of leagues in this district"
        className="mt-9 mb-7"
      />
      <form className="rounded-2xl bg-white p-7">
        <FormInput
          label="How many leagues do you want to add for {District} in the {startDate} - {endDate} period? *"
          type="number"
          value={quantityLeagues}
          onChange={onChange}
          {...(quantityLeagues === 0 && {
            error: {
              type: 'required',
              message: 'Enter a number greater than 0 and less than 30.',
            },
          })}
        />
      </form>
    </>
  );
};
