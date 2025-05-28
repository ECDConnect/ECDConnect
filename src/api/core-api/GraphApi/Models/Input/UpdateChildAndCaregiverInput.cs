using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Input
{
    public class UpdateChildAndCaregiverInput
    {
        public Guid Id { get; set; }
        public Guid? LanguageId { get; set; }
        public string Allergies { get; set; }
        public string Disabilities { get; set; }
        public string OtherHealthConditions { get; set; }
        public Guid WorkflowStatusId { get; set; }
        public bool IsActive { get; set; }
        public ChildUserUpdateInput User { get; set; }
        public ChildCaregiverInput Caregiver { get; set; }
        public Guid? ReasonForLeavingId { get; set; }
         public string InactiveReason { get; set; }
        public DateTime? InactiveDate { get; set; }
        public string InactivityComments { get; set; }
    }

    public class ChildUserUpdateInput
    {
        public Guid Id { get; set; }
        public bool IsActive { get; set; }
        public bool IsSouthAfricanCitizen { get; set; } // TODO: Is this needed?
        public string IdNumber { get; set; }
        public bool VerifiedByHomeAffairs { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Guid? GenderId { get; set; }
        public Guid? RaceId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string ContactPreference { get; set; } //TODO: Is this needed?
        public string profileImageUrl { get; set; }
    }

    public class ChildCaregiverInput
    {
        public Guid Id { get; set; }
        public string IdNumber { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public Guid? RelationId { get; set; }
        public Guid? EducationId { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string AdditionalFirstName { get; set; }
        public string AdditionalSurname { get; set; }
        public string AdditionalPhoneNumber { get; set; }
        public bool IsAllowedCustody { get; set; }
        public bool JoinReferencePanel { get; set; }
        public bool Contribution { get; set; }
        public UpdateSiteAddressInput SiteAddress { get; set; }
        public List<Guid> GrantIds { get; set; }
    }
}
