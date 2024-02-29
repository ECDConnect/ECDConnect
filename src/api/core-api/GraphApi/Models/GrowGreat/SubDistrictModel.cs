using System;
using ECDLink.DataAccessLayer.Entities;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class SubDistrictModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public Guid DistrictId { get; set; }

    }

    public class SubDistrictStatsModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public DateTime InsertedDate { get; set; }
        public District District { get; set; }
        public int TotalClinics { get; set; }
        public int TotalTeamLeads { get; set; }
        public int TotalHCWs { get; set; }
    }
}