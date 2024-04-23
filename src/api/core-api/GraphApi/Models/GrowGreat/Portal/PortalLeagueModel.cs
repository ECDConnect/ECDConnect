using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class BaseLeagueModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid LeagueTypeId { get; set; }
        public string LeagueTypeName { get; set; }
        public Guid? DistrictId { get; set; }
        public string DistrictName { get; set; }
        public DateTime InsertedDate { get; set; }
    }

    public class PortalLeagueModel : BaseLeagueModel
    {
        public List<BaseClinicModel> Clinics { get; set; }
    }

    public class LeagueWithRankingsModel : BaseLeagueModel
    {
        public List<ClinicWithPointsModel> Clinics { get; set; }
    }
}