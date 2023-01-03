using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using IdentityServer4.Events;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedFranchisor
    {
        public string Guid { get; set; }
        public string Name { get; set; }
        public string ContactPerson { get; set; }
        public string EmailAddress { get; set; }
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public DateTime CreatedOn { get; set; }
        public Owner Owner { get; set; }

    }
}
