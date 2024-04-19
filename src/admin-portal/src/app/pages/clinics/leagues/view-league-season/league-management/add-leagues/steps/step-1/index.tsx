import { Button, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AddLeaguesRouteState } from '../../types';
import { DistrictLeagues } from '@ecdlink/core';
import ROUTES from '../../../../../../../../routes/app.routes-constants';

interface Step1Props {
  district: DistrictLeagues;
  quantityLeagues: number;
  setQuantityLeagues: (value: number) => void;
}
export const Step1 = ({
  district,
  quantityLeagues,
  setQuantityLeagues,
}: Step1Props) => {
  const { state } = useLocation<AddLeaguesRouteState>();

  const history = useHistory();

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = Number(event.target.value);

    if (value > 30) {
      return setQuantityLeagues(undefined);
    }

    setQuantityLeagues(Number(value));
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Typography
          type="h1"
          color="textDark"
          text={`Step 1: Select the number of ${
            state?.districtId
              ? 'leagues in this district'
              : `super leagues for ${state?.startDate ?? ''} - ${
                  state?.endDate ?? ''
                }`
          }`}
          className="mt-9 mb-7"
        />
        <Button
          className="rounded-xl px-4 shadow-none"
          icon="XIcon"
          text="Cancel"
          type="filled"
          color="errorBg"
          textColor="tertiary"
          iconPosition="end"
          onClick={() =>
            history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT, {
              startDate: state?.startDate,
              endDate: state?.endDate,
            } as AddLeaguesRouteState)
          }
        />
      </div>
      <form className="rounded-2xl bg-white p-7">
        <FormInput
          isAdminPortalField
          label={`How many leagues do you want to add for ${
            district?.name ?? ''
          } in the ${state?.startDate ?? ''} - ${state?.endDate} period? *`}
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
