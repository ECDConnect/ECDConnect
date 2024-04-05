import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { ViewClinicReport } from '../../components/view-clinic-report/view-clinic-report';
import { TabItem, TabList } from '@ecdlink/ui';
import { useState } from 'react';

export const ClinicsTeamLeadView = () => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>();

  // TODO: replace with real query
  const { data } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  // TODO: replace with real clinics
  const clinics = data?.allPortalClinics?.slice(0, 2);

  const navigation =
    clinics?.map(
      (clinic): TabItem => ({
        title: clinic?.name ?? '',
        initActive: false,
        id: clinic?.id,
      })
    ) ?? [];

  const selectedClinic = clinics?.find(
    (clinic) => clinic?.id === selectedClinicId
  );

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
