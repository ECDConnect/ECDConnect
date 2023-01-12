using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using Microsoft.Azure.Documents;
using Org.BouncyCastle.Asn1.Crmf;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedBaseEntity
    {
        public string Guid { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string IdNumber { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Owner Owner { get; set; }
        public string localisedId { get; set; }

    }
}
