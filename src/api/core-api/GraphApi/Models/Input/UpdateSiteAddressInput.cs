using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Input
{
    public class UpdateSiteAddressInput
    {
        public Guid Id { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string Name { get; set; }
        public string PostalCode { get; set; }
        public Guid? ProvinceId { get; set; }
        public string Ward { get; set; }
    }
}
