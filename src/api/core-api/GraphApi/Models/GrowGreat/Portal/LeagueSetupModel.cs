using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class LeagueSetupModel
    {
        public List<LeagueWithClinicsModel> SuperLeagues { get; set; }
        public List<DistrictLeaguesModel> Districts { get; set; }
    }

    public class LeagueWithClinicsModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<SimpleClinicModel> Clinics { get; set; }
    }

    public class DistrictLeaguesModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<LeagueWithClinicsModel> Leagues { get; set; }
        public List<SimpleClinicModel> UnassignedClinics { get; set; }
    }
}