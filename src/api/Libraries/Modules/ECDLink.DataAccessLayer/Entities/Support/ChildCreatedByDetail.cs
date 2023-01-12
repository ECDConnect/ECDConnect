using System;

namespace ECDLink.DataAccessLayer.Entities
{
    public class ChildCreatedByDetail
    {
        public string FullName { get; set; }
        public string ChildUserId { get; set; }
        public string CreatedByName { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedByDate { get; set; }

    }
}
