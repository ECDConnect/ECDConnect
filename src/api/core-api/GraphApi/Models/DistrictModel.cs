using System;

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
        public int TotalSubDistricts { get; set; }
        public int TotalClinics { get; set; }
        public int TotalTeamLeads { get; set; }
        public int TotalHCWs { get; set; }
    }
}