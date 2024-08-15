using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
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
        public Guid? LinkedCaregiverId { get; set; }
        public string LinkedInfantId { get; set; }
        public Boolean? ClickedVisitTab { get; set; }
        public Boolean? ClickedProgressTab { get; set; }
        public Boolean? ClickedReferralsTab { get; set; }
        public Boolean? ClickedContactTab { get; set; }

    }
}

