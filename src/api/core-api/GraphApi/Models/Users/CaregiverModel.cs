using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class CaregiverModel
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Age { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public Guid? SiteAddressId { get; set; }
        public SiteAddress SiteAddress { get; set; }
        public Guid? RelationId { get; set; }
    }
}

