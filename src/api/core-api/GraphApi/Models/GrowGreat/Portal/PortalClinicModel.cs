using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalClinicInputModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public Guid SubDistrictId { get; set; }
        public Guid? SiteAddressId { get; set; }
        public Guid TeamLead1Id { get; set; }
        public Guid? TeamLead2Id { get; set; }
    }

    public class ClinicReportModel
    {
        public int TotalHCWs { get; set; }
        public int LeagueRanking { get; set; }
        public int PointsTotal { get; set; }
        public double MomsTargetPerc { get; set; }
        public string MomsTargetPercColor { get; set; }
        public double MomsTopTeamPerc { get; set; }
        public double MomsRankingPerc { get; set; }
        public double ChildrenTargetPerc { get; set; }
        public string ChildrenTargetPercColor { get; set; }
        public double ChildrenTopTeamPerc { get; set; }
        public double ChildrenRankingPerc { get; set; }
    }

    public class ClinicVisitReportModel
    {
        public ClientRegistrationModel ClientRegistration { get; set; }
        public PregnantMomsModel PregnantMoms { get; set; }
        public ChildClientsModel ChildClients { get; set; }
        public BreastFeedingClubPortalModel BreastFeedingClub { get; set; }
    }

    public class ClientRegistrationModel
    {
        public int TotalChildFoldersOpened { get; set; }
        public int TotalMotherFoldersOpened { get; set; }
        public int TotalMotherFoldersBefore20WeeksOpened { get; set; }
    }

    public class PregnantMomsModel
    {
        public int TotalMaternalDistress { get; set; }
        public int TotalMaternalMalnutrition { get; set; }
        public int TotalAlcoholAbuse { get; set; }
    }

    public class ChildClientsModel
    {
        public int TotalSupportGrant { get; set; }
        public int TotalGrowthMonitored { get; set; }
        public int TotalUpToDateImmunisations { get; set; }
        public int TotalUpToDateVitaminA { get; set; }
        public int TotalUpToDateDeworming { get; set; }
    }

    public class BreastFeedingClubPortalModel
    {
        public int TotalClubsHeld { get; set; }
        public int TotalCaregiversAttended { get; set; }
    }
}