import { Button, ScoreCard, StatusChip, Typography } from '@ecdlink/ui';
import { useLocation } from 'react-router';
import { ClinicsRouteState } from '../../clinics.types';
import { CreateClinicPanel } from '../create-clinic-panel/create-edit-clinic-panel';
import { usePanel } from '@ecdlink/core';
import { useQuery } from '@apollo/client';
import {
  GetClinicPointsData,
  GetClinicVisitReportData,
} from '@ecdlink/graphql';
import { ReportsDataChart } from './components/reportsDataChart';
import Pregnant from '../../../../../assets/gg-icons/pregnant.svg';
import Infant from '../../../../../assets/gg-icons/infant.svg';
import { ClientRegistration } from './components/client-registration';

export interface PointsReportSummaryDto {
  childrenRankingPerc: number;
  childrenTargetPerc: number;
  childrenTargetPercColor: string;
  childrenTopTeamPerc: number;
  leagueRanking: number;
  momsRankingPerc: number;
  momsTargetPerc: number;
  momsTargetPercColor: string;
  momsTopTeamPerc: number;
  pointsTotal: number;
  totalHCWs: number;
}

export const ViewClinicReport = () => {
  const location = useLocation<ClinicsRouteState>();
  const panel = usePanel();
  const clinic = location?.state?.clinic;

  const { data: clinicReportData } = useQuery(GetClinicVisitReportData, {
    fetchPolicy: 'cache-and-network',
    variables: {
      clinicId: clinic?.id,
      startDate: '2022-11-30T22:56:30.085Z',
      endDate: '2023-11-30T22:56:30.085Z',
    },
  });

  const { data: clinicPointsData } = useQuery(GetClinicPointsData, {
    fetchPolicy: 'cache-and-network',
    variables: {
      clinicId: clinic?.id,
    },
  });

  const dataFromClinicPointsData = clinicPointsData?.clinicPointsData;

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
      {/* <div className="mt-8">
        <PointsReportSummary
          dataFromClinicPointsData={dataFromClinicPointsData}
        />
      </div> */}
      <div className="mt-8">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textMid"
          text={`Summary`}
        />
        <div className="mt-2 flex w-full items-center gap-2">
          <StatusChip
            backgroundColour="darkBlue"
            borderColour="darkBlue"
            text={`${dataFromClinicPointsData?.totalHCWs} CHWs`}
            textColour={'white'}
            className={'px-4 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`#${dataFromClinicPointsData?.leagueRanking} in the league`}
            textColour={'white'}
            className={'px-4 py-1.5'}
          />
        </div>
      </div>
      <div className="mt-8 w-6/12 rounded-2xl bg-white p-6">
        <div className="bg-alertBg rounded-2xl p-2">
          <ScoreCard
            className="my-4"
            mainText={String(300)}
            hint="points earned"
            currentPoints={300}
            maxPoints={1000}
            barBgColour="uiLight"
            barColour="alertMain"
            bgColour="alertBg"
            barSize="small"
            textColour="black"
            barStatusChip={{
              backgroundColour: 'alertMain',
              borderColour: 'alertMain',
              textColour: 'white',
              text: 'Bronze',
            }}
          />
        </div>
      </div>
      <div className="bg-adminPortalBg mt-8 w-full">
        <div>
          <Typography
            type="h4"
            color="textDark"
            text={`% targets met so far this year`}
            align="left"
          />
          <Typography
            type="help"
            color="textDark"
            text={`October 2023 - September 2024`}
            align="left"
          />
        </div>
        <div className="flex gap-x-4">
          <ReportsDataChart
            clinic={clinic}
            targetPerc={clinicPointsData?.clinicPointsData?.momsTargetPerc}
            targetPercColor={
              clinicPointsData?.clinicPointsData?.momsTargetPercColor
            }
            topTeamPerc={clinicPointsData?.clinicPointsData?.momsTopTeamPerc}
            title={'Pregnant moms'}
            icon={Pregnant}
          />
          <ReportsDataChart
            clinic={clinic}
            targetPerc={clinicPointsData?.clinicPointsData?.childrenTargetPerc}
            targetPercColor={
              clinicPointsData?.clinicPointsData?.childrenTargetPercColor
            }
            topTeamPerc={
              clinicPointsData?.clinicPointsData?.childrenTopTeamPerc
            }
            title={'Children'}
            icon={Infant}
          />
        </div>
      </div>
      <div className="mt-8">
        <div>
          <Typography
            type="h4"
            weight="bold"
            color="textDark"
            text={`Visit information`}
            align="left"
          />
        </div>
        <div>
          <ClientRegistration
            totalCaregiversAttended={
              clinicReportData?.clinicVisitReportData?.breastFeedingClub
                ?.totalCaregiversAttended
            }
            totalClubsHeld={
              clinicReportData?.clinicVisitReportData?.breastFeedingClub
                ?.totalClubsHeld
            }
            totalGrowthMonitored={
              clinicReportData?.clinicVisitReportData?.childClients
                ?.totalGrowthMonitored
            }
            totalSupportGrant={
              clinicReportData?.clinicVisitReportData?.childClients
                ?.totalSupportGrant
            }
            totalUpToDateDeworming={
              clinicReportData?.clinicVisitReportData?.childClients
                ?.totalUpToDateDeworming
            }
            totalUpToDateImmunisations={
              clinicReportData?.clinicVisitReportData?.childClients
                ?.totalUpToDateImmunisations
            }
            totalUpToDateVitaminA={
              clinicReportData?.clinicVisitReportData?.childClients
                ?.totalUpToDateVitaminA
            }
            totalChildFoldersOpened={
              clinicReportData?.clinicVisitReportData?.clientRegistration
                ?.totalChildFoldersOpened
            }
            totalMotherFoldersBefore20WeeksOpened={
              clinicReportData?.clinicVisitReportData?.clientRegistration
                ?.totalMotherFoldersBefore20WeeksOpened
            }
            totalMotherFoldersOpened={
              clinicReportData?.clinicVisitReportData?.clientRegistration
                ?.totalMotherFoldersOpened
            }
            totalAlcoholAbuse={
              clinicReportData?.clinicVisitReportData?.pregnantMoms
                ?.totalAlcoholAbuse
            }
            totalMaternalDistress={
              clinicReportData?.clinicVisitReportData?.pregnantMoms
                ?.totalMaternalDistress
            }
            totalMaternalMalnutrition={
              clinicReportData?.clinicVisitReportData?.pregnantMoms
                ?.totalMaternalMalnutrition
            }
          />
        </div>
      </div>
    </div>
  );
};
