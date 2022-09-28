using System;
using System.Collections.Generic;
using System.Text;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ImportAllStaffItem
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string IDNumber { get; set; }
        public string ProgrammeTypeDesc { get; set; }
        public string PrammeTypeId { get; set; }
        public string SiteArea { get; set; }
        public string SiteName { get; set; }
        public string ClassName { get; set; }
        public string CoachName { get; set; }
        public string CoachID { get; set; }
        public string FranchisorhName { get; set; }
        public string CoachNumber { get; set; }
        public string SiteIndicator { get; set; }
        public Guid? ParentUserId { get; set; }
        public bool MatchWithSite { get; set; }
        public DateTime Dob { get; set; }

    }
}
