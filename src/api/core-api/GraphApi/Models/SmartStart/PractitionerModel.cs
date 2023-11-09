using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class PractitionerModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public bool? IsPrincipal { get; set; }
        public bool? IsFundaAppAdmin { get; set; }
        public bool? IsTrainee { get; set; }
        public Guid? PrincipalHierarchy { get; set; }
        public bool IsActive { get; set; }
        public Guid? CoachHierarchy { get; set; }
        public bool? IsRegistered { get; set; }
        public bool? ShareInfo { get; set; }
        public string SigningSignature { get; set; }
        public DateTime? DateLinked { get; set; }
        public DateTime? DateAccepted { get; set; }
        public DateTime? DateToBeRemoved { get; set; }
        public bool? IsLeaving { get; set; }
        public virtual ApplicationUser User { get; set; }
        public decimal Progress { get; set; }
        public string ProgrammeType { get; set; }
        public virtual SiteAddress SiteAddress { get; set; }
        public string UsePhotoInReport { get; set; }
        public bool? AttendedChildProgress { get; set; }
        public bool? IsOnStipend { get; set; }
        public bool? IsCompletedBusinessWalkThrough { get; set; }
        public bool? IsClubLeader { get; set; }
        public bool? IsClubSupport { get; set; }
        public bool? IsNewInClub { get; set; }
        public Guid? ClubId { get; set; }
        public string ClubName { get; set; }
        public string AttendanceRegisterLink { get; set; }
        public int? MaxChildren { get; set; }
        public bool? ConsentForPhoto { get; set; }
        public decimal? ParentFees { get; set; }
        public string LanguageUsedInGroups { get; set; }
        public DateTime? StartDate { get; set; }
        public int? MonthSinceFranchisee { get; set; }
        public bool? SetupTraineeInitiated { get; set; }
        public string StipendType { get; set; }
        public int DaysAbsentLastMonth { get; set; } = 0;
        public bool IsOnLeave { get; set; } = false;

        public List<AbsenteeDetail> Absentees { get; set; }
    }

}
