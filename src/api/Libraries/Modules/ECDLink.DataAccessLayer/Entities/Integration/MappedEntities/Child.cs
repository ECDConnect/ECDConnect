using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedChild : MappedBaseEntity
    {

        public DateTime? BirthDate { get; set; }
        public DateTime? StartDate { get; set; }
        public string EmergencyContactFullName { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string AlternativePickupFullname { get; set; }
        public string AlternativePickupFirstName { get; set; }
        public string AlternativePickupSurname { get; set; }
        public string AlternativePickupContactNumber { get; set; }
        public string EthnicGroup { get; set; }
        public string HomeLanguage { get; set; }
        public string GrantType { get; set; }
        public string Gender { get; set; }
        public bool? HasAllergy { get; set; }
        public string AllergyType { get; set; }
        public bool? HasDisability { get; set; }
        public string DisabilityType { get; set; }
        public string HealthConditions { get; set; }
        public bool? CaregiverPhotographyAndFilmingConsent { get; set; }
        public bool? CaregiverPopiaConsent { get; set; }
        public string PlaygroupGroup { get; set; }
        public string InactiveReason { get; set; }
        public bool? IsSouthAfricanCitizen { get; set; }
        public bool? HasIdNumber { get; set; }

        public MappedFranchisee Franchisee { get; set; }
        public MappedCaregiver Caregiver { get; set; }

    }

}
