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
    public class MappedFranchisee : MappedBaseEntity
    {
        public string ContactNumber { get; set; }
        public string Gender { get; set; }
        public string SiteArea { get; set; }
        public string SiteName { get; set; }
        public string PersonalNumber { get; set; }
        public string BirthDate { get; set; }
        public string CountryOfCitizenship { get; set; }
        public bool IsSouthAfricanCitizen { get; set; }
        public string Age { get; set; }
        public string ProgrammeType { get; set; }
        public string EthnicGroup { get; set; }
        public string Province { get; set; }

    }
}
