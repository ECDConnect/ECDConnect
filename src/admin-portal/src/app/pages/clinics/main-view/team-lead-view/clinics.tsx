import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { ViewClinicReport } from '../../components/view-clinic-report/view-clinic-report';
import { LoadingSpinner, TabItem, TabList } from '@ecdlink/ui';
import { useEffect, useState } from 'react';

interface ClinicsTeamLeadViewProps {
  setSelectedTabId?: (item: string) => void;
}

export const ClinicsTeamLeadView: React.FC<ClinicsTeamLeadViewProps> = ({
  setSelectedTabId,
}) => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>();

  // INFO: Same endpoint because the backend filters the clinics based on the user's role
  const { data, loading } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const clinics = data?.allPortalClinics;

  useEffect(() => {
    if (selectedClinicId && setSelectedTabId) {
      setSelectedTabId(selectedClinicId);
    } else {
      setSelectedTabId(clinics?.[0]?.id || '');
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
        <ViewClinicReport clinic={selectedClinic} />
      </div>
    </>
  );
};
