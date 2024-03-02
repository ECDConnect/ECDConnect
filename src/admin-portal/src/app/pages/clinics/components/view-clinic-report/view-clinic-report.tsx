import {
  Button,
  PointsProgressCard,
  ProgressBar,
  ScoreCard,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useLocation } from 'react-router';
import { ClinicsRouteState } from '../../clinics.types';
import { CreateClinicPanel } from '../create-clinic-panel/create-edit-clinic-panel';
import { usePanel } from '@ecdlink/core';
import { useQuery } from '@apollo/client';
import {
  GetClinicPointsData,
  GetClinicVisitReportData,
} from '@ecdlink/graphql';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

export const ViewClinicReport = () => {
  const location = useLocation<ClinicsRouteState>();
  const panel = usePanel();
  const clinic = location?.state?.clinic;

  const { data: clinicReportData, refetch } = useQuery(
    GetClinicVisitReportData,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        clinicId: clinic?.id,
        startDate: '2022-11-30T22:56:30.085Z',
        endDate: '2023-11-30T22:56:30.085Z',
      },
    }
  );

  const { data: clinicPointsData, refetch: refetchPointsData } = useQuery(
    GetClinicPointsData,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        clinicId: clinic?.id,
      },
    }
  );

  const displayEditPanel = () => {
    panel({
      noPadding: true,
      catchOnCancel: false,
      title: 'Edit a clinic',
      render: (onSubmit: any) => (
        <CreateClinicPanel
          key={`clinicPanelCreate`}
          isEdit={true}
          clinic={clinic}
          closeDialog={(clinicCreated: boolean) => {
            onSubmit();

            // if (clinicCreated) {
            //   refetch();
            // }
          }}
        />
      ),
    });
  };

  return (
    <div>
      <div>
        <Typography
          className="mb-8 truncate"
          type="h2"
          weight="bold"
          color="textMid"
          text={clinic?.name}
        />
      </div>
      <div className="w-full rounded-2xl bg-white p-8">
        <div className="mb-4 flex items-center gap-2">
          <Typography
            className="truncate"
            type="h3"
            weight="bold"
            color="textMid"
            text={`Clinic information`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`Unique ID:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.id}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`Phone number:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.phoneNumber}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`Adress:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.siteAddress?.addressLine1}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`Subd-district:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.subDistrict?.name}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`District:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.subDistrict?.district?.name}
          />
        </div>
        <div className="flex items-center gap-2">
          <Typography
            className="truncate"
            type="h4"
            weight="bold"
            color="textMid"
            text={`Province:`}
          />
          <Typography
            className="truncate"
            type="body"
            color="textMid"
            text={clinic?.subDistrict?.district?.province?.description}
          />
        </div>
        <div className="mt-4 flex w-full justify-end gap-2">
          <Button
            className="rounded-xl px-2"
            type="outlined"
            color="errorMain"
            textColor="tertiary"
            text="Copy unique ID"
            icon="DuplicateIcon"
            iconPosition="start"
            onClick={() => {
              navigator.clipboard.writeText(clinic?.id);
            }}
          />
          <Button
            className="rounded-xl px-2"
            type="filled"
            color="secondary"
            textColor="white"
            text="Edit"
            icon="PencilIcon"
            iconPosition="start"
            onClick={displayEditPanel}
          />
        </div>
      </div>
      <div className="mt-8">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textMid"
          text={`Summary`}
        />
        <div className="mt-2 flex items-center">
          <StatusChip
            backgroundColour="darkBlue"
            borderColour="darkBlue"
            text={`pclinics`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />{' '}
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`pclinics`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
        </div>
        <div className="mt-8 w-6/12 rounded-2xl bg-white p-8">
          <div className="bg-alertBg flex flex-col justify-center rounded-2xl p-12">
            <Typography
              align="center"
              type="unspecified"
              weight="bold"
              color="textMid"
              text={`2940`}
              fontSize="48"
            />
            <Typography
              type="h4"
              weight="bold"
              color="textDark"
              text={`poinst so far in Quarter number#`}
              align="center"
            />
            <ProgressBar
              className="h1"
              label={``}
              subLabel=""
              value={50}
              primaryColour={'uiLight'}
              secondaryColour={'alertMain'}
              size="medium"
              divides={[
                { widthPercentage: 40 },
                { widthPercentage: 40 },
                { widthPercentage: 20 },
              ]}
              textColour="textDark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
