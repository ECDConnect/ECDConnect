using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class DistrictModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public Guid ProvinceId { get; set; }

    }
}