using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class ImportAllChildInfoItem
    {
        public string Fullname { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Dob { get; set; }
        public string IDNumber { get; set; }

        public string ProgramType { get; set; }
        public string ECDType { get; set; }
        public string FranchiseeName { get; set; }
        public string FranchiseeIDNumber { get; set; }


        public string EmergencyContactFullName { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EthnicGroup { get; set; }
        public string Gender { get; set; }
        public string PlayGroupGroup { get; set; }


        public string PrimaryCaregiver { get; set; }
        public string GrantRecipient { get; set; }
        public string HomeLanguage { get; set; }
        public bool Allergies { get; set; }
        public bool Disabilities { get; set; }
        public bool HealthConditions { get; set; }
        public string TypeofAllergies { get; set; }
        public string TypeofDisabilities { get; set; }


        public string CaregiverEducation { get; set; }
        public string CaregiverIDNumber { get; set; }
        public string CaregiverLanguage { get; set; }
        public Guid LanguageId { get; set; }
        public string CaregiverRelationship { get; set; }
        public string CaregiverContactNo { get; set; }

        public string ParentFees { get; set; }

        public bool ConsentForPhoto { get; set; }
        public bool ConsentForPopia { get; set; }
        public string UserId { get; set; }

    }
}
