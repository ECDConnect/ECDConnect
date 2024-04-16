using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class LeagueWithRankingsModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }
        public DateTime InsertedDate { get; set; }
        public List<ClinicWithPointsModel> Clinics { get; set; }
    }
}