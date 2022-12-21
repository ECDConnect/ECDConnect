using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.DataIngestion
{
    [Table(nameof(SL_Ingestion_ChildCaregiver))]
    [EntityPermission(PermissionGroups.USER)]
    public class SL_Ingestion_ChildCaregiver : EntityBase<Guid>
    {
        public string ChildFullName { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string DateOfBirth { get; set; }
        public string IDNumber { get; set; }
        public string FranchiseeType { get; set; }
        public string ECDType { get; set; }
        public string FranchiseeName { get; set; }
        public string FranchiseeId { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string EthnicGroup { get; set; }
        public string Gender { get; set; }
        public string Playgroup { get; set; }
        public string CaregiverName { get; set; }
        public string Grant { get; set; }
        public string HomeLanguage { get; set; }
        public string HasAllergies { get; set; }
        public string HasDisabilities { get; set; }
        public string HealthConditions { get; set; }
        public string TypesOfAllergies { get; set; }
        public string TypesOfDisabilities { get; set; }
        public string Education { get; set; }
        public string CaregiverIdNumber { get; set; }
        public string CaregiverLanguage { get; set; }
        public string CaregiverRelationship { get; set; }
        public string CaregiverContactNumber { get; set; }
        public string ParentFees { get; set; }
        public string PhotoConsent { get; set; }
        public string POPIConsent { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string UserId { get; set; }
    }
}
