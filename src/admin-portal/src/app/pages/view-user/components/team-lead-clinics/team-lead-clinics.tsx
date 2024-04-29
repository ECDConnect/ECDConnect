import { useQuery } from '@apollo/client';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { Alert, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';

interface TeamLeadClinicProps {
  clinicIds?: string[];
}

export const TeamLeadClinics: React.FC<TeamLeadClinicProps> = ({
  clinicIds,
}) => {
  const [clinics, setClinics] = useState([]);
  const { data: clinicsData } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (clinicsData?.allPortalClinics?.length > 0 && clinicIds?.length > 0) {
      const tlClinics = clinicsData?.allPortalClinics?.filter((item) =>
        clinicIds?.some((x) => x === item?.id?.toString())
      );
      setClinics(tlClinics);
    }
  }, [clinicIds, clinicsData?.allPortalClinics]);

  return (
    <div>
      <div className="border-l-secondary  border-secondary m-10 mb-10  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row border-b-4 border-dashed pb-0">
            <Typography
              type={'h2'}
              text={'Clinic(s)'}
              color={'textMid'}
              className="my-4"
            />
          </div>

          {clinics?.length > 0 ? (
            <div className="my-4 w-full items-center justify-start">
              {clinics?.map((item) => {
                return (
                  <Typography
                    key={'clinic_' + item.id}
                    type={'body'}
                    className="flex w-full flex-nowrap"
                    color="textMid"
                    text={`${item?.name}, ${item?.subDistrict?.name}, ${item?.subDistrict?.district?.name}, ${item?.subDistrict?.district?.province?.description}`}
                  />
                );
              })}
            </div>
          ) : (
            <div className="my-4 w-full items-center justify-start">
              <Typography
                type={'body'}
                className="flex w-full flex-nowrap"
                color="textMid"
                text="No clinics"
              />
            </div>
          )}

          <Alert
            className={'mt-5 mb-3'}
            message={`To edit the Team Leads's clinic, go to the clinic(s) above & change the Team Lead assigned `}
            type={'info'}
          />
        </div>
      </div>
    </div>
  );
};
