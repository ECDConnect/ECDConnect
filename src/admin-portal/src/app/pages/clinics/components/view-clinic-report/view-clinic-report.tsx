import { Button, DatePicker, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { ClinicsRouteState } from '../../main-view/admin-view/clinics.types';
import { CreateClinicPanel } from '../create-clinic-panel/create-edit-clinic-panel';
import { usePanel } from '@ecdlink/core';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetClinicPointsData,
  GetClinicVisitReportData,
} from '@ecdlink/graphql';
import { ReportsDataChart } from './components/reportsDataChart';
import Pregnant from '../../../../../assets/gg-icons/pregnant.svg';
import Infant from '../../../../../assets/gg-icons/infant.svg';
import { ClientRegistration } from './components/client-registration';
import { PointsReportSummary } from './components/points-report-summary';
import { useEffect, useState } from 'react';
import { format, sub } from 'date-fns';
import { ViewClinicReportProps } from './view-clinic-report.types';
import ROUTES from '../../../../routes/app.routes-constants';
import { ReferralsRouteState } from '../../../referrals/types';

export interface PointsReportSummaryDto {
  childrenRankingPerc: number;
  childrenTargetPerc: number;
  childrenTargetPercColor: string;
  childrenTopLeagueTeamPerc: number;
  leagueRanking: number;
  momsRankingPerc: number;
  momsTargetPerc: number;
  momsTargetPercColor: string;
  momsTopLeagueTeamPerc: number;
  pointsTotal: number;
  totalHCWs: number;
}

export const ViewClinicReport = ({
  clinic: clinicFromProps,
}: ViewClinicReportProps) => {
  const isTeamLead = true;
  const location = useLocation<ClinicsRouteState>();
  const history = useHistory();
  const panel = usePanel();
  const clinic = clinicFromProps || location?.state?.clinic;
  const today = new Date();
  const initialBefore30Days = sub(today, {
    days: 30,
  });
  const lastYear = sub(today, {
    years: 1,
  });

  const [dateRange, setDateRange] = useState([initialBefore30Days, today]);
  const [startDate, endDate] = dateRange;

  const [fetchVisitInformation, { data: clinicReportData, loading }] =
    useLazyQuery(GetClinicVisitReportData, {
      fetchPolicy: 'cache-and-network',
      variables: {
        clinicId: clinic?.id,
        startDate: startDate,
        endDate: endDate,
      },
    });

  const { data: clinicPointsData } = useQuery(GetClinicPointsData, {
    fetchPolicy: 'cache-and-network',
    variables: {
      clinicId: clinic?.id,
    },
  });

  const dataFromClinicPointsData = clinicPointsData?.clinicPointsData;

  const clinicInformation = [
    { name: 'Unique ID:', value: clinic?.id },
    { name: 'Phone number:', value: clinic?.phoneNumber },
    { name: 'Address:', value: clinic?.siteAddress?.addressLine1 },
    { name: 'Sub-district:', value: clinic?.subDistrict?.name },
    { name: 'District:', value: clinic?.subDistrict?.district?.name },
    {
      name: 'Province:',
      value: clinic?.subDistrict?.district?.province?.description,
    },
  ];

  useEffect(() => {
    if (startDate && endDate) {
      fetchVisitInformation({
        fetchPolicy: 'cache-and-network',
        variables: {
          clinicId: clinic?.id,
          startDate: startDate,
          endDate: endDate,
        },
      });
    }
  }, [clinic?.id, endDate, fetchVisitInformation, startDate]);

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
          }}
        />
      ),
    });
  };

  return (
    <div>
      <Typography
        className="mb-8 truncate"
        type="h1"
        weight="bold"
        color="textMid"
        text={clinic?.name}
      />
      <div className="w-full rounded-2xl bg-white p-8">
        <div className="mb-4 flex items-center gap-2">
          <Typography
            className="truncate"
            type="h2"
            weight="bold"
            color="textMid"
            text={`Clinic information`}
          />
        </div>
        {clinicInformation.map((info, index) => (
          <div className="flex items-center gap-2" key={info.name + index}>
            <Typography
              className="truncate"
              type="h4"
              weight="bold"
              color="textMid"
              text={info.name}
            />
            <Typography
              className="truncate"
              type="body"
              color="textMid"
              text={info.value}
            />
          </div>
        ))}
        {!isTeamLead && (
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
        )}
      </div>
      <div className="mt-8">
        <PointsReportSummary
          dataFromClinicPointsData={dataFromClinicPointsData}
        />
      </div>

      <div className="bg-adminPortalBg mt-8 w-full">
        <div>
          <Typography
            type="h1"
            color="textDark"
            text={`% targets met so far this year`}
            align="left"
          />
          <Typography
            type="help"
            color="textDark"
            text={`October ${lastYear.getFullYear()} - ${format(
              today,
              'MMMM yyyy'
            )}`}
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
            topTeamPerc={
              clinicPointsData?.clinicPointsData?.momsTopLeagueTeamPerc
            }
            targetRanking={clinicPointsData?.clinicPointsData?.momsRankingPerc}
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
              clinicPointsData?.clinicPointsData?.childrenTopLeagueTeamPerc
            }
            targetRanking={
              clinicPointsData?.clinicPointsData?.childrenRankingPerc
            }
            title={'Children'}
            icon={Infant}
          />
        </div>
      </div>
      <div className="mt-8 flex w-full items-center justify-between">
        <Typography
          type="h1"
          weight="bold"
          color="textDark"
          text={`Visit information`}
          align="left"
        />
        <DatePicker
          isFullWidth={false}
          showChevronIcon
          hideCalendarIcon
          className="w-64 rounded-xl"
          selectsRange
          startDate={startDate}
          endDate={endDate}
          maxDate={today}
          colour="secondary"
          textColour="white"
          onChange={(update) => {
            setDateRange(update);
          }}
        />
      </div>
      <ClientRegistration
        isLoading={loading}
        clinicReportData={clinicReportData?.clinicVisitReportData}
      />
      {isTeamLead && (
        <div className="mt-9 flex gap-4">
          <Button
            className="rounded-xl px-2"
            type="filled"
            color="secondary"
            textColor="white"
            text="See referrals"
            icon="ClipboardListIcon"
            onClick={() =>
              history.push(ROUTES.REFERRALS.ROOT, {
                clinicIds: [clinic?.id],
              } as ReferralsRouteState)
            }
          />
          <Button
            className="rounded-xl px-2"
            type="outlined"
            color="secondary"
            textColor="secondary"
            text="See CHWs"
            icon="UserGroupIcon"
            onClick={() => {}}
          />
        </div>
      )}
    </div>
  );
};
