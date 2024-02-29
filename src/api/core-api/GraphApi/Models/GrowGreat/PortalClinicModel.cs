using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class PortalClinicModel
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
        public int LeaguePosition { get; set; }
        public int TotalQuarterPoints { get; set; }
    }

    public class ClinicVisitReportModel
    {
        public ClientRegistration ClientRegistration { get; set; }
        public PregnantMoms PregnantMoms { get; set; }
        public ChildClients ChildClients { get; set; }
        public BreastFeedingClub BreastFeedingClub { get; set; }
    }

    public class ClientRegistration
    {
        public int TotalChildFoldersOpened { get; set; }
        public int TotalMotherFoldersOpened { get; set; }
        public int TotalMotherFoldersBefore20WeeksOpened { get; set; }
    }

    public class PregnantMoms
    {
        public int TotalMaternalDistress { get; set; }
        public int TotalMaternalMalnutrition { get; set; }
        public int TotalAlcoholAbuse { get; set; }
    }

    public class ChildClients
    {
        public int TotalSupportGrant { get; set; }
        public int TotalGrowthMonitored { get; set; }
        public int TotalUpToDateImmunisations { get; set; }
        public int TotalUpToDateVitaminA { get; set; }
        public int TotalUpToDateDeworming { get; set; }
    }

    public class BreastFeedingClub
    {
        public int TotalClubsHeld { get; set; }
        public int TotalCaregiversAttended { get; set; }
    }
}