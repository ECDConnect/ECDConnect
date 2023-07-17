using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedTrainee : MappedBaseEntity
    {
        public string WhatsAppNumber { get; set; }
        public string SiteArea { get; set; }
        public bool? IsFranchisee { get; set; } = false;
        public bool? HasStarterLicence { get; set; } = false;
        public bool? HasAttendedStartupTraining { get; set; } = false;
        public bool? HasReceivedPlaykit { get; set; } = false;
        public bool? HasReceivedAdminFile { get; set; } = false;
        public bool? HasPassedSmartSpaceVisit { get; set; } = false;
        public bool? IsSmartSpaceVisitValidated { get; set; } = false;
        public bool? IsOnStipend { get; set; } = false;
        public bool? HasGivenPhotoConsent { get; set; } = false;
        public bool? HasAcceptedChildAgreement { get; set; } = false;
        public bool? HasAcceptedFranchiseeAgreement { get; set; } = false;
        public bool? HasPropertyTitleDeed { get; set; } = false;
        public bool? LivesOnProperty { get; set; } = false;
        public bool? OwnsProgrammeVenue { get; set; } = false;
        public bool? IsPropertyOnUnproclaimedLand { get; set; } = false;
        public bool? HasAcceptedStipendAgreement { get; set; } = false;
        public DateTime? StarterLicenceDate { get; set; }
        public DateTime? SmartSpaceLicenceDate { get; set; }
        public DateTime? ConsolidationMeetingDate { get; set; }
        public DateTime? FranchiseeAgreementAcceptedDate { get; set; }
        public DateTime? StartDate { get; set; }
        public string HomeAddressLine1 { get; set; }
        public string HomeAddressLine2 { get; set; }
        public string HomeAddressLine3 { get; set; }
        public string HomeAddressPostalCode { get; set; }
        public string HighestEducationLevel { get; set; }
        public string StipendType { get; set; }
        public string ProgrammeType { get; set; }
        public string ConsolidationMeetingStatus { get; set; }
        public string IsAdminFileAndPlaykitValidated { get; set; }
        public string PreferredCommunicationLanguage { get; set; }
        public MappedFranchisor Franchisor { get; set; }
        public MappedCoach Coach { get; set; }        

    }
}
