using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class AddChildTokenModel
    {
        public bool IsSouthAfricanCitizen { get; set; }

        public string IdNumber { get; set; }

        public bool VerifiedByHomeAffairs { get; set; }

        public DateTime DateOfBirth { get; set; }

        public Guid? RaceId { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string FullName { get; set; }

        public string ContactPreference { get; set; }

        public string ProfileImageUrl { get; set; }

        public Guid? GenderId { get; set; }

        public string UserId { get; set; }

        public Guid? LanguageId { get; set; }

        public string Allergies { get; set; }

        public string Disabilities { get; set; }

        public string OtherHealthConditions { get; set; }
        public Guid? WorkflowStatusId { get; set; }

        public string InsertedBy { get; set; }
    }

    public class AddChildSiteAddressTokenModel
    {
        public Guid? ProvinceId { get; set; }

        public string Name { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string AddressLine3 { get; set; }

        public string PostalCode { get; set; }

        public string Ward { get; set; }
    }

    public class AddChildCaregiverTokenModel
    {
        //Caregiver
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

        public bool JoinReferencePanel { get; set; }

        public bool Contribution { get; set; }
    }

    public class AddChildRegistrationTokenModel
    {
        public string UserId { get; set; }
        public string File { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }

    }

    public class AddChildUserConsentTokenModel
    {
        public string UserId { get; set; }

        public bool ChildPhotoConsentAccepted { get; set; }

        public bool PersonalInformationAgreementAccepted { get; set; }
    }
}
