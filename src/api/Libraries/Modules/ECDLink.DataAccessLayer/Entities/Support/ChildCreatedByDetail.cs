using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities
{
    public class ChildCreatedByDetail
    {
        public string FullName { get; set; }
        public string ChildUserId { get; set; }
        public string CreatedByName { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedByDate { get; set; }
        public string ClassroomName { get; set; }
        public string PractitionerName { get; set; }


    }
}
