import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { LoadingSpinner, TabItem, TabList } from '@ecdlink/ui';
import { EmptyClinic } from '../clinics/main-view/team-lead-view/components/empty-clinic';
import { ViewClinicReport } from '../clinics/components/view-clinic-report/view-clinic-report';
import { useMemo, useState } from 'react';
import { TeamMeetingsMainPage } from './team-meetings';
import { TeamMeetingsRouteState } from './team-meetings-types';
import { useLocation } from 'react-router';

interface TeamMeetingsRootProps {
  isFromTeamMeetings: boolean;
}

export const TeamMeetingsRoot: React.FC<TeamMeetingsRootProps> = ({
  isFromTeamMeetings,
}) => {
  const { data, loading } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });
  console.log({ data });
  const [selectedClinicId, setSelectedClinicId] = useState<string>();
  const { state } = useLocation<TeamMeetingsRouteState>();
  console.log({ state });
  const clinics = data?.allPortalClinics;
  const selectedClinic =
    clinics?.find((clinic) => clinic?.id === selectedClinicId) ?? clinics?.[0];

  const navigation =
    clinics?.map(
      (clinic): TabItem => ({
        title: clinic?.name ?? '',
        initActive: false,
        id: clinic?.id,
      })
    ) ?? [];
  const renderClinicView = useMemo(() => {
    if (selectedClinic) {
      return <TeamMeetingsMainPage clinicId={selectedClinic?.id} />;
    } else {
      return <EmptyClinic />;
    }
  }, [selectedClinic]);

  if (loading) {
    return (
      <LoadingSpinner
        size="medium"
        backgroundColor="secondary"
        spinnerColor="adminPortalBg"
      />
    );
  }

  return (
    <>
      {clinics?.length > 1 && (
        <TabList
          className="w-full overflow-y-hidden bg-white"
          activeTabClassName=" bg-infoBb text-secondary border-b-secondary border-b-4 items-center flex justify-center"
          tabItems={navigation}
          tabSelected={(tab) => setSelectedClinicId(tab?.id)}
        />
      )}
      <div className="bg-adminPortalBg rounded-b-2xl p-4">
        {renderClinicView}
      </div>
    </>
  );
};
