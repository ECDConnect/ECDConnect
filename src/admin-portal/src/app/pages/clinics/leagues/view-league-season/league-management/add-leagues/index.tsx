import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  LoadingSpinner,
} from '@ecdlink/ui';
import ROUTES from '../../../../../../routes/app.routes-constants';
import { useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { useHistory, useLocation } from 'react-router';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  LeagueIdEnum,
  LeagueInputModelInput,
  LeagueSetupDto,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import {
  GetLeagueSetup,
  AddLeagues as AddLeaguesMutation,
} from '@ecdlink/graphql';
import { AddLeaguesRouteState } from './types';

export const AddLeagues = () => {
  const [leagues, setLeagues] = useState<
    { [league: string]: LeagueInputModelInput }[]
  >([]);
  const [quantityLeagues, setQuantityLeagues] = useState<number>();

  const { state } = useLocation<AddLeaguesRouteState>();

  const allowMultipleLeagues = state?.allowMultipleLeagues;

  const initialStep = allowMultipleLeagues === false ? 1 : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);

  const history = useHistory();

  const { setNotification } = useNotifications();

  const apolloClient = useApolloClient();

  const { leagueSetupDetails } =
    apolloClient.readQuery<{ leagueSetupDetails?: LeagueSetupDto }>({
      query: GetLeagueSetup,
    }) || {};

  const { loading } = useQuery<{ leagueSetupDetails?: LeagueSetupDto }>(
    GetLeagueSetup,
    {
      fetchPolicy: 'cache-and-network',
      skip: !!leagueSetupDetails,
    }
  );

  const [addLeagues, { loading: addingLeagues }] = useMutation(
    AddLeaguesMutation,
    {}
  );

  const isToAddSuperLeagues = state?.leagueType === LeagueIdEnum.SuperLeague;

  const district = leagueSetupDetails?.districts?.find(
    (item) => item.id === state?.districtId
  );

  const allUnassignedClinicsForSuperLeagues =
    leagueSetupDetails?.districts.reduce((accumulator, district) => {
      return accumulator.concat(district.unassignedClinics);
    }, []);

  const leagueNumber = allowMultipleLeagues
    ? currentStep
    : isToAddSuperLeagues
    ? leagueSetupDetails?.superLeagues.length + 1
    : district?.leagues.length + 1;

  const currentLeagueData = Object.values(
    leagues?.find(
      (item) =>
        Object.keys(item)[0] ===
        `league-${allowMultipleLeagues ? currentStep : leagueNumber}`
    ) ?? {}
  )?.[0];

  const allSelectedClinicsIds = leagues.flatMap(
    (item) => Object.values(item)[0].clinicIds
  );
  const availableClinics =
    (isToAddSuperLeagues
      ? allUnassignedClinicsForSuperLeagues
      : district?.unassignedClinics
    )?.filter(
      (clinic) =>
        !allSelectedClinicsIds.includes(clinic.id) ||
        currentLeagueData?.clinicIds.includes(clinic.id)
    ) ?? [];

  const isToShowPreviousButton = currentStep > initialStep;
  const isLastStep =
    allowMultipleLeagues === false || currentStep === quantityLeagues;
  const isDisabledNextButton =
    (allowMultipleLeagues !== false &&
      currentStep === initialStep &&
      !quantityLeagues) ||
    ((currentStep > initialStep || allowMultipleLeagues === false) &&
      (!currentLeagueData?.name ||
        currentLeagueData?.name.length > 30 ||
        !currentLeagueData?.clinicIds?.length));

  const paths: BreadcrumbProps['paths'] = [
    {
      name: 'Clinics',
      url: ROUTES.CLINICS.ALL_CLINICS,
    },
    {
      name: 'Leagues',
      url: ROUTES.CLINICS.LEAGUES.ROOT,
    },
    {
      name: `${state?.startDate ?? ''} - ${state?.endDate ?? ''} Leagues`,
      url: ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
      state,
    },
    {
      name: `${
        isToAddSuperLeagues
          ? 'Add Super Leagues -'
          : `Add Leagues - ${district?.name ?? ''},`
      } ${state?.startDate ?? ''} to ${state?.endDate ?? ''}`,
      url: '',
    },
  ];

  const onUpdatedLeagues = (updatedLeague: {
    [league: string]: LeagueInputModelInput;
  }) => {
    if (!leagues.length) {
      return setLeagues([updatedLeague]);
    }

    const updatedLeagueKey = Object.keys(updatedLeague)[0];

    const leagueIndex = leagues.findIndex(
      (item) => Object.keys(item)[0] === updatedLeagueKey
    );

    if (leagueIndex === -1) {
      setLeagues([...leagues, updatedLeague]);
      return;
    }

    const updatedLeagues = leagues?.map((item) => {
      const itemKey = Object.keys(item)[0];

      if (itemKey === updatedLeagueKey) {
        return updatedLeague;
      }
      return item;
    });

    setLeagues(updatedLeagues);
  };

  const onChangeQuantityLeagues = (quantity: number) => {
    setLeagues([]);
    setQuantityLeagues(quantity);
  };

  const onPreviousStep = () => {
    if (isToShowPreviousButton) {
      setCurrentStep((prevState) => prevState - 1);
    }
  };

  const onNextStep = () => {
    if (currentStep < quantityLeagues + 1) {
      setCurrentStep((prevState) => prevState + 1);
    }
  };

  const onSave = () => {
    const input = leagues.map((item) => Object.values(item)[0]);

    addLeagues({
      variables: {
        input,
      },
    }).then((res) => {
      if (!!res?.data?.addLeagues) {
        setNotification({
          title: isToAddSuperLeagues
            ? 'Super leagues added!'
            : 'Leagues added!',
          variant: NOTIFICATION.SUCCESS,
        });
        history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT, {
          ...state,
        });
      }
    });
  };

  if (loading) {
    return (
      <LoadingSpinner
        className="mt-8"
        size="medium"
        backgroundColor="secondary"
        spinnerColor="adminPortalBg"
      />
    );
  }

  return (
    <div>
      <Breadcrumb paths={paths} />
      {currentStep === 0 && (
        <Step1
          district={district}
          quantityLeagues={quantityLeagues}
          setQuantityLeagues={onChangeQuantityLeagues}
        />
      )}
      {currentStep > 0 && (
        <Step2
          availableClinics={availableClinics}
          currentLeagueData={currentLeagueData}
          district={district}
          leagueNumber={leagueNumber}
          onChange={onUpdatedLeagues}
        />
      )}
      <div className="mt-8 flex gap-2">
        {isToShowPreviousButton && (
          <Button
            className="rounded-2xl px-24"
            icon="ArrowCircleLeftIcon"
            type="outlined"
            color="secondary"
            textColor={addingLeagues ? 'textMid' : 'secondary'}
            text="Previous"
            isLoading={addingLeagues}
            disabled={addingLeagues}
            onClick={onPreviousStep}
          />
        )}
        <Button
          className="rounded-2xl px-24"
          icon={isLastStep ? 'SaveIcon' : 'ArrowCircleRightIcon'}
          type="filled"
          color="secondary"
          textColor="white"
          isLoading={addingLeagues}
          disabled={isDisabledNextButton || addingLeagues}
          text={isLastStep ? 'Save' : 'Next'}
          onClick={() => (isLastStep ? onSave() : onNextStep())}
        />
      </div>
    </div>
  );
};
