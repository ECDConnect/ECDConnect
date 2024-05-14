using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class BaseSiteAddressModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string PostalCode { get; set; }
        public string Ward { get; set; }

        public BaseSiteAddressModel(SiteAddress siteAddress)
        {
            Id = siteAddress.Id;
            Name = siteAddress.Name;
            AddressLine1 = siteAddress.AddressLine1;
            AddressLine2 = siteAddress.AddressLine2;
            AddressLine3 = siteAddress.AddressLine3;
            PostalCode = siteAddress.PostalCode;
            Ward = siteAddress.Ward;
        }
    }
}
