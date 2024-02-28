using ECDLink.DataAccessLayer.Entities;
using iTextSharp.text;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class DistrictModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public Guid ProvinceId { get; set; }

    }

    public class DistrictStatsModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public DateTime InsertedDate { get; set; }
        public Province Province { get; set; }
        public ICollection<SubDistrict> SubDistricts { get; set; }
        public int TotalSubDistricts { get; set; }
        public int TotalClinics { get; set; }
        public int TotalTeamLeads { get; set; }
        public int TotalHCWs { get; set; }
    }

}