using ECDLink.DataAccessLayer.Entities.Clinics;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class BaseClinicModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class SimpleClinicModel : BaseClinicModel
    {
        public List<BaseTeamLeadModel> TeamLeads { get; set; }
        public string SubDistrictName { get; set; }
    }

    public class ClinicWithPointsModel : SimpleClinicModel
    {
        public int LeagueRanking { get; set; }
        public int PointsTotal { get; set; }
    }

    public class ClinicModel : BaseClinicModel
    {
        public string PhoneNumber { get; set; }
        public SiteAddressModel SiteAddress { get; set; }
        public GrowGreatLeagueModel League { get; set; }
        public List<TeamLeadModel> TeamLeads { get; set; }
        public List<ClinicMemberModel> ClinicMembers { get; set; }
        public ClinicPointsModel Points { get; set; }

        public ClinicModel(Clinic clinic, ClinicPointsModel points)
        {
            Id = clinic.Id;
            Name = clinic.Name;
            PhoneNumber = clinic.PhoneNumber;

            if (clinic.SiteAddress != null)
            {
                SiteAddress = new SiteAddressModel(clinic.SiteAddress);
            }

            TeamLeads = clinic.TeamLeads.Select(x => new TeamLeadModel(x.TeamLead, x.WelcomeMessage)).ToList();
            ClinicMembers = clinic.HealthCareWorkers.Select(x => new ClinicMemberModel(x)).ToList();

            var league = clinic.Leagues.FirstOrDefault(x => x.IsActive);
            if (league != null) 
            {
                League = new GrowGreatLeagueModel(league.League);
            }

            Points = points;
        }
    }
}
