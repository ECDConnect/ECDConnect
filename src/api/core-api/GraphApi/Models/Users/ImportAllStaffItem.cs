using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class ImportAllStaffItem
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string IDNumber { get; set; }
        public string ProgrammeTypeDesc { get; set; }
        public string ProgrammeTypeId { get; set; }
        public string SiteArea { get; set; }
        public string SiteName { get; set; }
        public string ClassName { get; set; }
        public string CoachName { get; set; }
        public string CoachID { get; set; }
        public string FranchisorhName { get; set; }
        public string CoachNumber { get; set; }
        public string SiteIndicator { get; set; }
        public string Password { get; set; }
        public string SecurityStamp { get; set; }
        public string PasswordConcurrency { get; set; }
        public string ParentUserId { get; set; }
        public string ParentUserIdNumber { get; set; }
        public bool MatchWithSite { get; set; }
        public DateTime Dob { get; set; }
        public string UserId { get; set; }

    }
}
