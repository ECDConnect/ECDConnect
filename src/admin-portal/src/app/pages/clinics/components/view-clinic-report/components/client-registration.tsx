import { Divider, Typography } from '@ecdlink/ui';
import Pregnant from '../../../../../../assets/gg-icons/pregnant.svg';
import Infant from '../../../../../../assets/gg-icons/infant.svg';
import Nutrition from '../../../../../../assets/gg-icons/nutrition.svg';
import HealthCare from '../../../../../../assets/gg-icons/healthcare.svg';
import Protection from '../../../../../../assets/gg-icons/protection.svg';
import { ClinicVisitReportDto } from '@ecdlink/core';
import { Fragment } from 'react';

interface ClientRegistrationProps {
  clinicReportData: ClinicVisitReportDto;
}

export const ClientRegistration: React.FC<ClientRegistrationProps> = ({
  clinicReportData,
}) => {
  const totalCaregiversAttended =
    clinicReportData?.breastFeedingClub?.totalCaregiversAttended;

  const totalClubsHeld = clinicReportData?.breastFeedingClub?.totalClubsHeld;

  const totalGrowthMonitored =
    clinicReportData?.childClients?.totalGrowthMonitored;

  const totalSupportGrant = clinicReportData?.childClients?.totalSupportGrant;

  // const totalUpToDateDeworming = clinicReportData?.childClients
  //   ?.totalUpToDateDeworming

  const totalUpToDateImmunisations =
    clinicReportData?.childClients?.totalUpToDateImmunisations;

  const totalUpToDateVitaminA =
    clinicReportData?.childClients?.totalUpToDateVitaminA;

  const totalChildFoldersOpened =
    clinicReportData?.clientRegistration?.totalChildFoldersOpened;

  const totalMotherFoldersBefore20WeeksOpened =
    clinicReportData?.clientRegistration?.totalMotherFoldersBefore20WeeksOpened;

  const totalMotherFoldersOpened =
    clinicReportData?.clientRegistration?.totalMotherFoldersOpened;

  const totalAlcoholAbuse = clinicReportData?.pregnantMoms?.totalAlcoholAbuse;

  const totalMaternalDistress =
    clinicReportData?.pregnantMoms?.totalMaternalDistress;

  const totalMaternalMalnutrition =
    clinicReportData?.pregnantMoms?.totalMaternalMalnutrition;

  const visitInformation = [
    {
      title: 'Client registration',
      subTitle: 'Number of folders opened',
      children: [
        {
          icon: Infant,
          name: 'child folders opened',
          value: totalChildFoldersOpened,
        },
        {
          icon: Pregnant,
          name: 'pregnant mom folders opened',
          value: totalMotherFoldersOpened,
        },
        {
          icon: Pregnant,
          name: 'pregnant mom folders opened before 20 weeks of pregnancy',
          value: totalMotherFoldersBefore20WeeksOpened,
        },
      ],
    },
    {
      title: 'Pregnant mom clients',
      subTitle: '',
      children: [
        {
          icon: Pregnant,
          name: 'child folders opened',
          value: totalMaternalDistress,
        },
        {
          icon: Nutrition,
          iconColor: 'secondaryGG',
          name: 'clients screened for maternal malnutrition',
          value: totalMaternalMalnutrition,
        },
        {
          icon: Pregnant,
          name: 'clients screened for alcohol abuse',
          value: totalAlcoholAbuse,
        },
      ],
    },
    {
      title: 'Child clients',
      subTitle: '',
      children: [
        {
          icon: HealthCare,
          iconColor: 'tertiaryGG',
          name: 'child clients are receiving the child support grant',
          value: totalSupportGrant,
        },
        {
          icon: Nutrition,
          iconColor: 'secondaryGG',
          name: "children's growth monitored",
          value: totalGrowthMonitored,
        },
        {
          icon: Protection,
          iconColor: 'quaternaryGG',
          name: 'children up to date with immunisations',
          value: totalUpToDateImmunisations,
        },
        {
          icon: Protection,
          iconColor: 'quaternaryGG',
          name: 'children up to date with Vitamin A supplements',
          value: totalUpToDateVitaminA,
        },
        {
          icon: Protection,
          iconColor: 'quaternaryGG',
          name: 'children up to date with deworming',
          value: totalCaregiversAttended,
        },
      ],
    },
    {
      title: 'Breastfeeding clubs',
      subTitle: '',
      children: [
        {
          icon: Nutrition,
          iconColor: 'secondaryGG',
          name: 'breastfeeding clubs held',
          value: totalClubsHeld,
        },
        {
          icon: Nutrition,
          iconColor: 'secondaryGG',
          name: 'caregivers attended breastfeeding clubs',
          value: totalCaregiversAttended,
        },
      ],
    },
  ];

  return (
    <div className="mt-8 rounded-2xl bg-white p-8">
      {visitInformation.map((info) => (
        <Fragment key={info.title}>
          <Typography
            type="h2"
            color="textDark"
            text={info.title}
            align="left"
          />
          <Typography
            type="help"
            color="textMid"
            text={info.subTitle}
            align="left"
            className="w-44"
          />
          <Divider className="mt-4" dividerType="dashed" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {info?.children?.map((child) => (
              <Fragment key={child.name}>
                <div className="mb-8 flex items-start gap-4">
                  <div>
                    <div
                      className={`bg-${
                        child?.iconColor ?? 'primaryGG'
                      } flex h-9 w-9 items-center justify-center rounded-full p-2`}
                    >
                      <img src={child.icon} alt="icon" className="h-9 w-9" />
                    </div>
                  </div>
                  <div>
                    <Typography
                      type="h1"
                      color="textDark"
                      text={String(child.value)}
                      align="left"
                    />
                    <Typography
                      type="help"
                      color="textMid"
                      text={child.name}
                      align="left"
                      className="w-44"
                    />
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
