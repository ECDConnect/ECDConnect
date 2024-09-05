using ECDLink.DataAccessLayer.Entities;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class BaseProvinceModel
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
    }

    public class BaseSiteAddressModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Municipality { get; set; }
        public string PostalCode { get; set; }
        public BaseProvinceModel Province { get; set; }
        public Guid? ProvinceId { get; set; }
        public string Ward { get; set; }
        public string Area { get; set; }

        public BaseSiteAddressModel(SiteAddress siteAddress)
        {
            Id = siteAddress.Id;
            Name = siteAddress.Name;
            AddressLine1 = siteAddress.AddressLine1;
            AddressLine2 = siteAddress.AddressLine2;
            AddressLine3 = siteAddress.AddressLine3;
            PostalCode = siteAddress.PostalCode;
            Ward = siteAddress.Ward;
            Longitude = siteAddress.Longitude;
            Latitude = siteAddress.Latitude;
            Municipality = siteAddress.Municipality;
            Area = siteAddress.Area;
            if (siteAddress.Province != null)
            {
                ProvinceId = siteAddress.Province.Id;
                Province = new BaseProvinceModel()
                {
                    Id = siteAddress.Province.Id,
                    Description = siteAddress.Province.Description
                };

            }
        }
    }
}
