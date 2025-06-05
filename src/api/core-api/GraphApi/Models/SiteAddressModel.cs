using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class SiteAddressModel
    {
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string PostalCode { get; set; }
        public string Ward { get; set; }
        public Guid? ProvinceId { get; set; }
        public ProvinceModel Province { get; set; }

        public SiteAddressModel(SiteAddress siteAddress)
        {
            Name = siteAddress.Name;
            AddressLine1 = siteAddress.AddressLine1;
            AddressLine2 = siteAddress.AddressLine2;
            AddressLine3 = siteAddress.AddressLine3;
            PostalCode = siteAddress.PostalCode;
            Ward = siteAddress.Ward;
            ProvinceId = siteAddress.ProvinceId;
            Province = siteAddress.Province != null 
                ? new ProvinceModel() { Description = siteAddress.Province.Description }
                : null;
        }
    }
    public class ProvinceModel
    {
        public string Description { get; set; }
    }
}
