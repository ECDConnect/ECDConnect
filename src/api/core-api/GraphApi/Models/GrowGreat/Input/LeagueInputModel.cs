using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class LeagueInputModel
    {
        public string Name { get; set; }
        public Guid TypeId { get; set; }
        public Guid? DistrictId { get; set; }
        public List<Guid> ClinicIds { get; set; }
    }
}
