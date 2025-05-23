using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class PractitionerImportItem
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string IDNumber { get; set; }
        public bool ConsentForPhoto { get; set; }
        public Guid LanguageId { get; set; }
        public int ParentFees { get; set; }
        public DateTime StartDate { get; set; }
        public int MaxChildren { get; set; }
        public DateTime Dob { get; set; }

    }
}
