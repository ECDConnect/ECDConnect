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
    public class MappedCaregiver : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string RelationshipType { get; set; }
        public string HighestEducationLevel { get; set; }
        public string Language { get; set; }

    }
}
