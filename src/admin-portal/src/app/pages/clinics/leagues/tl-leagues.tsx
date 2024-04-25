import { TabItem, TabList, Typography } from '@ecdlink/ui';
import { useQuery } from '@apollo/client';
import { PortalLeagueDto } from '@ecdlink/core';
import { GetLeaguesForTeamLead } from '@ecdlink/graphql';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../../hooks/useUser';
import { TLLeagueDetails } from './view-league-season/league-performance/league-details/tl-league-details';

export const TLLeagues = () => {
  const { user } = useUser();

  const [selectedLeagueId, setSelectedLeagueId] = useState('');

  const { data: leagues } = useQuery<{
    leaguesForTeamLead?: PortalLeagueDto[];
  }>(GetLeaguesForTeamLead, {
    variables: {
      teamLeadUserId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const formattedLeagues: Irow[] = useMemo(
    () =>
      leagues?.leaguesForTeamLead
        ?.slice()
        ?.sort(
          (a, b) =>
            new Date(b.insertedDate).getTime() -
            new Date(a.insertedDate).getTime()
        )
        ?.map((league) => ({
          leagueId: league?.id,
          name: league?.name ?? '-',
          type: league?.leagueTypeName ?? '-',
          clinics: league?.clinics?.length ?? 0,
          districtId: league?.districtId,
          dateAdded: league?.insertedDate
            ? format(new Date(league.insertedDate), 'dd/MM/yyyy')
            : '-',
        })) || [],
    [leagues?.leaguesForTeamLead]
  );

  useEffect(() => {
    if (formattedLeagues && formattedLeagues.length > 0) {
      setSelectedLeagueId(formattedLeagues[0].leagueId);
    }
  }, [formattedLeagues]);

  const navigation =
    formattedLeagues?.map(
      (leaque): TabItem => ({
        title: leaque?.name ?? '',
        initActive: false,
        id: leaque?.leagueId,
      })
    ) ?? [];

  const renderLeagueDetails = useMemo(() => {
    if (selectedLeagueId && formattedLeagues?.length > 0) {
      return <TLLeagueDetails leagueId={selectedLeagueId} />;
    } else {
      return (
        <div className="p-8">
          <div className="flex items-center justify-center p-24">
            <Typography
              type={'h4'}
              weight={'bold'}
              text={
                'Your clinics are not assigned to a league OR you do not have any clinics'
              }
              color={'textDark'}
            />
          </div>
        </div>
      );
    }
  }, [formattedLeagues?.length, selectedLeagueId]);

  return (
    <>
      {formattedLeagues?.length > 0 && (
        <TabList
          className="w-full overflow-y-hidden bg-white"
          activeTabClassName=" bg-infoBb text-secondary border-b-secondary border-b-4 items-center flex justify-center p-10"
          tabItems={navigation}
          tabSelected={(tab) => setSelectedLeagueId(tab?.id)}
        />
      )}
      <div className="bg-adminPortalBg rounded-b-2xl p-4">
        {renderLeagueDetails}
      </div>
    </>
  );
};
