import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  LoadingSpinner,
} from '@ecdlink/ui';
import ROUTES from '../../../../../../routes/app.routes-constants';
import { useEffect, useMemo, useState } from 'react';
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
  usePrevious,
} from '@ecdlink/core';
import {
  GetLeagueSetup,
  AddLeagues as AddLeaguesMutation,
  EditLeague,
  MutationEditLeagueArgs,
  SimpleClinicModel,
} from '@ecdlink/graphql';
import { AddLeaguesRouteState } from './types';

export const AddLeagues = () => {
  const [leagues, setLeagues] = useState<
    { [league: string]: LeagueInputModelInput }[]
  >([]);
  const [quantityLeagues, setQuantityLeagues] = useState<number>();

  const { state } = useLocation<AddLeaguesRouteState>();

  const previousState = usePrevious(state) as AddLeaguesRouteState;

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

  const [editLeague, { loading: editingLeagues }] = useMutation(EditLeague, {});

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

  const leagueKey = `league-${
    allowMultipleLeagues ? currentStep : leagueNumber
  }`;

  const currentLeagueData = useMemo(
    () =>
      Object.values(
        leagues?.find((item) => Object.keys(item)[0] === leagueKey) ?? {}
      )?.[0],
    [leagueKey, leagues]
  );

  const allSelectedClinicsIds = leagues.flatMap(
    (item) => Object.values(item)[0].clinicIds
  );

  const availableClinics = useMemo(() => {
    const unassignedClinics = isToAddSuperLeagues
      ? allUnassignedClinicsForSuperLeagues
      : district?.unassignedClinics;

    let available = unassignedClinics ?? [];

    if (!!state?.leagueToEdit) {
      available = [...(state?.leagueToEdit?.clinics ?? []), ...available];
    }

    return (
      available?.filter(
        (clinic) =>
          !allSelectedClinicsIds.includes(clinic.id) ||
          currentLeagueData?.clinicIds.includes(clinic.id)
      ) ?? []
    );
  }, [
    allSelectedClinicsIds,
    allUnassignedClinicsForSuperLeagues,
    currentLeagueData?.clinicIds,
    district?.unassignedClinics,
    isToAddSuperLeagues,
    state?.leagueToEdit,
  ]);

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
      state: {
        endDate: state?.endDate,
        startDate: state?.startDate,
      } as AddLeaguesRouteState,
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

  const checkLeagueNameExist = () => {
    const leagueName = currentLeagueData?.name;
    const leagueNameExists =
      leagueSetupDetails?.districts?.find((district) =>
        district.leagues.some((league) => league.name === leagueName)
      ) ||
      leagueSetupDetails?.superLeagues.some(
        (league) => league.name === leagueName
      );

    if (leagueNameExists) {
      setNotification({
        title: 'League name already exists!',
        variant: NOTIFICATION.ERROR,
      });
    }

    return leagueNameExists;
  };

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
      const leagueNameExists = checkLeagueNameExist();

      if (leagueNameExists) {
        return;
      }

      setCurrentStep((prevState) => prevState + 1);
    }
  };

  const onBack = () => {
    history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT, {
      startDate: state?.startDate,
      endDate: state?.endDate,
    } as AddLeaguesRouteState);
  };

  const findChanges = (
    initialClinics: SimpleClinicModel[],
    finalIds: string[]
  ) => {
    const initialIds = initialClinics.map((clinic) => clinic.id);

    const clinicsToRemove = initialIds.filter((id) => !finalIds.includes(id));

    const clinicsToAdd = finalIds.filter((id) => !initialIds.includes(id));

    return { clinicsToRemove, clinicsToAdd };
  };

  const onSave = () => {
    const input = leagues.map((item) => Object.values(item)[0]);

    const leagueNameExists = checkLeagueNameExist();

    if (leagueNameExists) return;

    if (state?.leagueToEdit) {
      const { clinicsToAdd, clinicsToRemove } = findChanges(
        state?.leagueToEdit?.clinics,
        input[0].clinicIds
      );

      editLeague({
        variables: {
          leagueId: state?.leagueToEdit?.id,
          name: input?.[0].name,
          clinicsToAdd,
          clinicsToRemove,
        } as MutationEditLeagueArgs,
      }).then((res) => {
        if (!!res?.data?.editLeague) {
          setNotification({
            title: 'League updated!',
            variant: NOTIFICATION.SUCCESS,
          });
          onBack();
        }
      });
    } else {
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
          onBack();
        }
      });
    }
  };

  useEffect(() => {
    if (state?.leagueToEdit && previousState !== state) {
      setLeagues([
        {
          [leagueKey]: {
            ...currentLeagueData,
            clinicIds: state?.leagueToEdit?.clinics.map((clinic) => clinic.id),
            name: state?.leagueToEdit?.name,
          },
        },
      ]);
    }
  }, [
    currentLeagueData,
    leagueKey,
    leagues,
    previousState,
    state,
    state?.leagueToEdit,
  ]);

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
            textColor={
              addingLeagues || editingLeagues ? 'textMid' : 'secondary'
            }
            text="Previous"
            isLoading={addingLeagues || editingLeagues}
            disabled={addingLeagues || editingLeagues}
            onClick={onPreviousStep}
          />
        )}
        <Button
          className="rounded-2xl px-24"
          icon={isLastStep ? 'SaveIcon' : 'ArrowCircleRightIcon'}
          type="filled"
          color="secondary"
          textColor="white"
          isLoading={addingLeagues || editingLeagues}
          disabled={isDisabledNextButton || addingLeagues || editingLeagues}
          text={isLastStep ? 'Save' : 'Next'}
          onClick={() => (isLastStep ? onSave() : onNextStep())}
        />
      </div>
    </div>
  );
};
