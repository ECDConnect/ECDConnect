import { ActionModal } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { LeagueSeasonRouteState } from '../../../types';
import ROUTES from '../../../../../../../routes/app.routes-constants';
import {
  DistrictLeagues,
  LeagueIdEnum,
  LeagueWithClinics,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DeleteLeague } from '@ecdlink/graphql';
import { AddLeaguesRouteState } from '../../add-leagues/types';

interface LeagueActionModalProps {
  onClose: () => void;
  onRefetchData: () => void;
  district?: DistrictLeagues;
  leagues: LeagueWithClinics[];
}
export const LeagueActionModal = ({
  onClose,
  onRefetchData,
  district,
  leagues,
}: LeagueActionModalProps) => {
  const [selectedDeleteOption, setSelectedDeleteOption] = useState(false);
  const [selectedEditOption, setSelectedEditOption] = useState(false);

  const { state } = useLocation<LeagueSeasonRouteState>();

  const history = useHistory<AddLeaguesRouteState>();

  const { setNotification } = useNotifications();

  const [deleteLeague, { loading: deletingLeague }] = useMutation(
    DeleteLeague,
    {}
  );

  const isEmptyDistrict =
    !district?.unassignedClinics.length && !leagues.length;

  const onDeleteLeague = (leagueId: string) => {
    deleteLeague({
      variables: {
        leagueId,
      },
    }).then((res) => {
      if (!!res?.data?.deleteLeague) {
        setNotification({
          title: 'League removed',
          variant: NOTIFICATION.SUCCESS,
        });
        onRefetchData();
        onClose();
      }
    });
  };

  if (selectedDeleteOption || selectedEditOption) {
    return (
      <ActionModal
        icon="QuestionMarkCircleIcon"
        iconColor="infoMain"
        title={`Which league do you want to ${
          selectedDeleteOption
            ? `
        remove ${!!district ? `from ${district.name} district` : ''} `
            : 'add or remove clinics'
        } ?`}
        buttonClass="rounded-2xl"
        actionButtons={leagues?.map((league) => ({
          isLoading: deletingLeague,
          disabled: deletingLeague,
          type: 'outlined',
          colour: 'secondary',
          textColour: deletingLeague ? 'textMid' : 'secondary',
          text: league.name,
          onClick: () => {
            if (selectedDeleteOption) {
              onDeleteLeague(league.id);
            } else {
              history.push(
                ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES,
                {
                  ...state,
                  leagueToEdit: league,
                  allowMultipleLeagues: false,
                  districtId: district?.id,
                  leagueType: district
                    ? LeagueIdEnum.League
                    : LeagueIdEnum.SuperLeague,
                }
              );
              onClose();
            }
          },
        }))}
      />
    );
  }

  return (
    <ActionModal
      icon="QuestionMarkCircleIcon"
      iconColor="infoMain"
      title="What would you like to do?"
      detailText={
        isEmptyDistrict
          ? 'There are no clinics on the admin portal yet. Add clinics first.'
          : ''
      }
      buttonClass="rounded-2xl"
      actionButtons={
        isEmptyDistrict
          ? []
          : [
              {
                leadingIcon: 'PlusCircleIcon',
                type: 'outlined',
                colour: 'secondary',
                textColour: 'secondary',
                text: 'Add a league',
                onClick: () => {
                  history.push(
                    ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ADD_LEAGUES,
                    {
                      ...state,
                      allowMultipleLeagues: false,
                      districtId: district?.id,
                      leagueType: district
                        ? LeagueIdEnum.League
                        : LeagueIdEnum.SuperLeague,
                    }
                  );
                  onClose();
                },
              },
              {
                leadingIcon: 'TrashIcon',
                type: 'outlined',
                colour: 'secondary',
                textColour: 'secondary',
                text: 'Remove a league',
                onClick: () => setSelectedDeleteOption(true),
              },
              {
                leadingIcon: 'PencilIcon',
                type: 'outlined',
                colour: 'secondary',
                textColour: 'secondary',
                text: 'Add or remove clinics from a league',
                onClick: () => setSelectedEditOption(true),
              },
            ]
      }
    />
  );
};
