using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class LeagueClinicsModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public List<LeagueClinicPointsModel> Clinics { get; set; }
    }
    public class LeagueClinicPointsModel
    {
        public Guid ClinicId { get; set; }
        public string ClinicName { get; set; }
        public int LeagueRanking { get; set; }
        public int PointsTotal { get; set; }
    }
}