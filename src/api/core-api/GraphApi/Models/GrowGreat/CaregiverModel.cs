using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class CaregiverModel
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Age { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public Guid? HealthCareWorkerId { get; set; }
        public Guid? SiteAddressId { get; set; }
        public SiteAddress SiteAddress { get; set; }
        public Guid? RelationId { get; set; }
    }

    public class CaregiverClients
    {
        public virtual ICollection<Infant> Infants { get; set; }
        public Mother Mother { get; set; }
    }
}

