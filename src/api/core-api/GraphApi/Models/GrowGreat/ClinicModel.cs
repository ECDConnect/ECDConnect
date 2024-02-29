using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class ClinicModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public SiteAddressModel SiteAddress { get; set; }
        public GrowGreatLeagueModel League { get; set; }
        public List<TeamLeadModel> TeamLeads { get; set; }
        public List<ClinicMemberModel> ClinicMembers { get; set; }

        public int LeagueRanking { get; set; }
        public int PointsTotal { get; set; }
        public int MaxPointsTotal { get; set; }
        public List<PointsActivityModel> Points { get; set; }

        public ClinicModel(Clinic clinic, List<PointsLibrary> activities)
        {
            Id = clinic.Id;
            Name = clinic.Name;
            PhoneNumber = clinic.PhoneNumber;

            if (clinic.SiteAddress != null)
            {
                SiteAddress = new SiteAddressModel(clinic.SiteAddress);
            }

            TeamLeads = clinic.TeamLeads.Select(x => new TeamLeadModel(x.TeamLead)).ToList();
            ClinicMembers = clinic.HealthCareWorkers.Select(x => new ClinicMemberModel(x)).ToList();

            var league = clinic.Leagues.FirstOrDefault(x => x.IsActive);
            if (league != null) 
            {
                League = new GrowGreatLeagueModel(league.League);
            }

            // TODO - Add real data
            LeagueRanking = 3;
            PointsTotal = 850;
            MaxPointsTotal = 5000;
            Points = activities.Select(x => new PointsActivityModel()
            {
                PointsLibraryId = x.Id,
                ActivityName = x.Activity,
                SubActivityName = x.SubActivity,
                PointsTotal = 50,
            }).ToList();
        }
    }
}
