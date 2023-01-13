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
    public class MappedChild : MappedBaseEntity
    {
        
        public DateTime BirthDate { get; set; }
        public string EmergencyContactFullName { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string EthnicGroup { get; set; }
        public string Language { get; set; }
        public string HomeLanguage { get; set; }
        public string GrantType { get; set; }
        public string Gender { get; set; }
        public string HasAllergy { get; set; }
        public string AllergyType { get; set; }
        public string HasDisability { get; set; }
        public string DisabilityType { get; set; }
        public string HealthConditions { get; set; }
        public string CaregiverPhotographyAndFilmingConsent { get; set; }
        public bool CaregiverPopiaConsent { get; set; }

    }

}
