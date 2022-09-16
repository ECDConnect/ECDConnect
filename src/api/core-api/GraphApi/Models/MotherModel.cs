using System;
using ECDLink.DataAccessLayer.Entities;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class MotherModel
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Age { get; set; }
        public string PhoneNumber { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? ExpectedDateOfDelivery { get; set; }
        public Guid? HealthCareWorkerId { get; set; }
        public Guid? SiteAddressId { get; set; }
        public Guid? RelationId { get; set; }
        public Relation Relation { get; set; }
        public SiteAddress SiteAddress { get; set; }
    }
}

