using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.DataIngestion
{
    [Table(nameof(SL_Ingestion_User))]
    [EntityPermission(PermissionGroups.USER)]
    public class SL_Ingestion_User : EntityBase<Guid>
    {
        public string SameSite { get; set; }
        public string Indicator { get; set; }
        public string ParentId { get; set; }
        public string ProgrammeIndicator { get; set; }
        public string FullName { get; set; }
        public string IDNumber { get; set; }
        public string PersonalNumber { get; set; }
        public string FranchiseTypeOfProgramme { get; set; }
        public string ECDType { get; set; }
        public string SiteArea { get; set; }
        public string SiteName { get; set; }
        public string ClassName { get; set; }
        public string CoachName { get; set; }
        public string CoachId { get; set; }
        public string FranchisorName { get; set; }
        public string CoachContactNumber { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string UserId { get; set; }
    }
}
