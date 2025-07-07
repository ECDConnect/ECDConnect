using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models;


public class PractitionerModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public bool? IsPrincipal { get; set; }
    public Guid? PrincipalHierarchy { get; set; }
    public bool IsActive { get; set; }
    public Guid? CoachHierarchy { get; set; }
    public string CoachName { get; set; }
    public string CoachProfilePic { get; set; }
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
    public bool? IsCompletedBusinessWalkThrough { get; set; }
    public string AttendanceRegisterLink { get; set; }
    public bool? ConsentForPhoto { get; set; }
    public decimal? ParentFees { get; set; }
    public string LanguageUsedInGroups { get; set; }
    public DateTime? StartDate { get; set; }
    public int DaysAbsentLastMonth { get; set; } = 0;
    public bool IsOnLeave { get; set; } = false;
    public bool? ClickedCommunityTab { get; set; }
    public List<AbsenteeDetail> Absentees { get; set; }
    public List<UserPermissionModel> Permissions { get; set; }
    public DateTime? CommunitySectionViewDate { get; set; }
    public bool ProgressWalkthroughComplete { get; set; }
}
