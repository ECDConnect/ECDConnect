import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { LoadingSpinner, TabItem, TabList } from '@ecdlink/ui';
import { EmptyClinic } from '../clinics/main-view/team-lead-view/components/empty-clinic';
import { ViewClinicReport } from '../clinics/components/view-clinic-report/view-clinic-report';
import { useEffect, useMemo, useState } from 'react';
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

  const [selectedClinicId, setSelectedClinicId] = useState<string>();
  const [tabIndex, setTabIndex] = useState(0);
  const { state } = useLocation<TeamMeetingsRouteState>();
  const clinics = data?.allPortalClinics;
  const selectedClinic =
    clinics?.find((clinic) => clinic?.id === selectedClinicId) ?? clinics?.[0];
  useEffect(() => {
    if (state?.clinicId) {
      const clinicIndex = clinics.findIndex((x) => x.id === state?.clinicId);
      setTabIndex(clinicIndex);
      setSelectedClinicId(state?.clinicId);
    }
  }, [clinics, state?.clinicId]);
  const navigation =
    clinics?.map(
      (clinic, index): TabItem => ({
        title: clinic?.name ?? '',
        initActive: false,
        id: clinic?.id,
        index,
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
      <div className="mt-16">
        <LoadingSpinner
          size="medium"
          backgroundColor="secondary"
          spinnerColor="adminPortalBg"
        />
      </div>
    );
  }

  return (
    <>
      {clinics?.length > 1 && (
        <TabList
          className="w-full overflow-y-hidden bg-white"
          activeTabClassName=" bg-infoBb text-secondary border-b-secondary border-b-4 items-center flex justify-center"
          tabItems={navigation}
          tabSelected={(tab) => {
            setSelectedClinicId(tab?.id);
            setTabIndex(tab?.index);
          }}
          setSelectedIndex={tabIndex}
        />
      )}
      <div className="bg-adminPortalBg rounded-b-2xl p-4">
        {renderClinicView}
      </div>
    </>
  );
};
