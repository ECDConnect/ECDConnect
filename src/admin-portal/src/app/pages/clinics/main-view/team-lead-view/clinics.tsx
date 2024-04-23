import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { ViewClinicReport } from '../../components/view-clinic-report/view-clinic-report';
import { LoadingSpinner, TabItem, TabList } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { EmptyClinic } from './components/empty-clinic';

interface ClinicsTeamLeadViewProps {
  setSelectedTabId?: (item: string) => void;
  isFromTeamMeetings?: boolean;
  clinicId?: string;
}

export const ClinicsTeamLeadView: React.FC<ClinicsTeamLeadViewProps> = ({
  setSelectedTabId,
  isFromTeamMeetings,
  clinicId,
}) => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>();

  // INFO: Same endpoint because the backend filters the clinics based on the user's role
  const { data, loading } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const clinics = data?.allPortalClinics;

  useEffect(() => {
    if (typeof setSelectedTabId === 'function') {
      if (selectedClinicId) {
        setSelectedTabId(selectedClinicId);
      } else {
        setSelectedTabId(clinics?.[0]?.id || '');
      }
    }
  }, [clinics, selectedClinicId, setSelectedTabId]);

  const navigation =
    clinics?.map(
      (clinic): TabItem => ({
        title: clinic?.name ?? '',
        initActive: false,
        id: clinic?.id,
      })
    ) ?? [];

  const selectedClinic =
    clinics?.find((clinic) => clinic?.id === selectedClinicId) ?? clinics?.[0];

  const teamMeetingBodyClinic = clinics?.find(
    (clinic) => clinic?.id === clinicId
  );

  const renderClinicView = useMemo(() => {
    if (selectedClinic) {
      return (
        <ViewClinicReport
          clinic={selectedClinic}
          isFromTeamMeetings={isFromTeamMeetings}
        />
      );
    } else {
      return <EmptyClinic />;
    }
  }, [selectedClinic, isFromTeamMeetings]);

  const renderClinicViewFromTeamMeetings = useMemo(() => {
    if (clinicId && clinics?.length > 1) {
      return (
        <ViewClinicReport
          clinic={teamMeetingBodyClinic}
          isFromTeamMeetings={isFromTeamMeetings}
        />
      );
    } else {
      return <EmptyClinic />;
    }
  }, [clinicId, clinics?.length, isFromTeamMeetings, teamMeetingBodyClinic]);

  if (loading) {
    return (
      <LoadingSpinner
        size="medium"
        backgroundColor="secondary"
        spinnerColor="adminPortalBg"
      />
    );
  }

  if (clinicId && isFromTeamMeetings) {
    return (
      <div className="bg-adminPortalBg rounded-b-2xl p-4">
        {renderClinicViewFromTeamMeetings}
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
          tabSelected={(tab) => setSelectedClinicId(tab?.id)}
        />
      )}
      <div className="bg-adminPortalBg rounded-b-2xl p-4">
        {renderClinicView}
      </div>
    </>
  );
};
