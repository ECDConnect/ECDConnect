using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedFranchisee : MappedBaseEntity
    {
        public string PersonalNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string Gender { get; set; }
        //public string SiteArea { get; set; }
        //public string SiteName { get; set; }        
        public string BirthDate { get; set; }
        public string CountryOfCitizenship { get; set; }
        public bool? IsSouthAfricanCitizen { get; set; }
        public string Age { get; set; }
        public string ProgrammeType { get; set; }
        public string EthnicGroup { get; set; }
        public string Province { get; set; }

        public string EmailAddress { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string NextOfKinFirstName { get; set; }
        public string NextOfKinSurname { get; set; }
        public string NextOfKinContactNumber { get; set; }
        public string InactivityComments { get; set; }
        public string MonthsSinceFranchisee { get; set; }
        public bool? VerifiedByHomeAffairs { get; set; }
        public bool? ConsentForPhoto { get; set; }
        public bool? IsPrincipal { get; set; } = false;
        public bool? AttendedChildProgress { get; set; }
        public bool? AttendedBusinessSkills { get; set; }
        public bool? IsClubLeader { get; set; } = false;
        public DateTime? StartDate { get; set; }
        public string LanguageUsedInGroups { get; set; }
        public string ReasonForLeaving { get; set; }
        public string PreferredCommunicationLanguage { get; set; }
        public MappedFranchisor Franchisor { get; set; }
        public MappedCoach Coach { get; set; }
        public Principal Principal { get; set; }
        public MappedAddress SiteAddress { get; set; }
        public string StipendType { get; set; }
        public DateTime? StarterLicenceDate { get; set; }
        public string ConsolidationMeetingStatus { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }
        public DateTime? LatestPQADate { get; set; }
    }
}
