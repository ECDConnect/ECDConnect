using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System;
using ECDLink.Security.Extensions;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities;
using EcdLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Core.Services.Interfaces;

namespace EcdLink.Api.CoreApi.Services
{
    public class LeagueService : ILeagueService
    {
        private IGenericRepository<League, Guid> _leagueRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<District, Guid> _districtRepo;

        private IPointsEngineService _pointsEngineService;

        private Guid _uId;

        public LeagueService(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IPointsEngineService pointsEngineService,
            IGenericRepositoryFactory repoFactory)
        {
            _uId = contextAccessor.HttpContext.GetUser().Id;

            _leagueRepo = repoFactory.CreateRepository<League>(userContext: _uId);
            _clinicRepo = repoFactory.CreateRepository<Clinic>(userContext: _uId);
            _districtRepo = repoFactory.CreateRepository<District>(userContext: _uId);

            _pointsEngineService = pointsEngineService;
        }

        public LeagueSetupModel GetLeagueSetup()
        {
            // TODO - Reset this so it is working for the next season (should be this year, to next year)
            var startDate = new DateTime(DateTime.Now.Year - 1, 10, 1);
            var endDate = new DateTime(DateTime.Now.Year, 9, 30);

            // Districts
            var districts = _districtRepo.GetAll().Where(x => x.IsActive).ToList();


            // Unassigned clinics
            var unassignedClinics = _clinicRepo.GetAll()
                .Where(x => !x.Leagues.Any(x => x.League.IsActive && x.League.StartDate == startDate && x.League.EndDate == endDate))
                .Select(x => new
                {
                    x.SubDistrict.DistrictId,
                    DistrictName = x.SubDistrict.District.Name,
                    Clinic = new SimpleClinicModel 
                    { 
                        Id = x.Id, 
                        Name = x.Name, 
                        SubDistrictName = x.SubDistrict.Name, 
                        TeamLeads = x.TeamLeads.Select(x => new BaseTeamLeadModel 
                        {
                            Id = x.TeamLeadId,
                            FirstName = x.TeamLead.User.FirstName,
                            Surname = x.TeamLead.User.Surname
                        }).ToList()

                    }
                }
                ).ToList();


            // Leagues
            var leagues = _leagueRepo.GetAll()
                .Where(x =>
                    x.StartDate == startDate
                    && x.EndDate == endDate)
                .Select(x => new
                {
                    x.DistrictId,
                    LeagueTypeName = x.LeagueType.Name,
                    League = new LeagueWithClinicsModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Clinics = x.Clinics.Select(x => new SimpleClinicModel
                        {
                            Id = x.Clinic.Id,
                            Name = x.Clinic.Name,
                            SubDistrictName = x.Clinic.SubDistrict.Name,
                            TeamLeads = x.Clinic.TeamLeads.Select(x => new BaseTeamLeadModel
                            {
                                Id = x.TeamLeadId,
                                FirstName = x.TeamLead.User.FirstName,
                                Surname = x.TeamLead.User.Surname
                            }).ToList()

                        }).ToList()
                    },
                })
                .ToList();

            // Organise districts
            var districtModels = new List<DistrictLeaguesModel>();
            foreach (var district in districts)
            {
                var unassignedDistrictClinics = unassignedClinics
                    .Where(x => x.DistrictId == district.Id)
                    .Select(x => x.Clinic)
                    .ToList();

                var districtLeagues = leagues
                    .Where(x => x.DistrictId.HasValue && x.DistrictId == district.Id)
                    .Select(x => x.League)
                    .ToList();

                districtModels.Add(new DistrictLeaguesModel
                {
                    Id = district.Id,
                    Name = district.Name,
                    Leagues = districtLeagues,
                    UnassignedClinics = unassignedDistrictClinics
                });
            }

            return new LeagueSetupModel
            {
                SuperLeagues = leagues
                    .Where(x => x.LeagueTypeName == "Super League")
                    .Select(x => x.League).ToList(),

                Districts = districtModels
            };
        }
    
        public void AddLeagues(List<LeagueInputModel> input)
        {
            // TODO - Reset this so it is working for the next season (should be this year, to next year)
            var startDate = new DateTime(DateTime.Now.Year - 1, 10, 1);
            var endDate = new DateTime(DateTime.Now.Year, 9, 30);

            // Should we validate that all league types and clinics exist?

            var newLeagues = new List<League>();
            foreach (var leagueInput in input)
            {
                var leagueId = Guid.NewGuid();
                var league = new League()
                {
                    Id = leagueId,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _uId.ToString(),
                    DistrictId = leagueInput.DistrictId,
                    Name = leagueInput.Name,
                    LeagueTypeId = leagueInput.TypeId,
                    StartDate = startDate,
                    EndDate = endDate,
                    IsActive = true,
                    TenantId = Constants.Tenants.GrowGreatTenantId,
                    Clinics = leagueInput.ClinicIds.Select(x => new ClinicLeague
                    {
                        IsActive = true,
                        LeagueId = leagueId,
                        ClinicId = x,
                        TenantId = Constants.Tenants.GrowGreatTenantId,
                    }).ToList(),                    
                };

                newLeagues.Add(league);
            }

            _leagueRepo.InsertMany(newLeagues);
        }

        public List<PortalLeagueModel> GetLeagues(string searchString, Guid? districtId = null, PagedQueryInput pagingInput = null)
        {
            var startDate = DateTime.Now.Month > 9 ? new DateTime(DateTime.Now.Year, 10, 1) : new DateTime(DateTime.Now.Year - 1, 10, 1);
            var endDate = DateTime.Now.Month > 9 ? new DateTime(DateTime.Now.Year + 1, 10, 1) : new DateTime(DateTime.Now.Year, 10, 1);

            var leagues = _leagueRepo.GetAll(pagingInput)
                .Where(x => x.StartDate >= startDate 
                    && x.EndDate <= endDate
                    && (!districtId.HasValue || x.DistrictId == districtId)
                    && (string.IsNullOrWhiteSpace(searchString) || x.Name.Contains(searchString)))
                .Select(x => new PortalLeagueModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    InsertedDate = x.InsertedDate,
                    LeagueTypeId = x.LeagueTypeId,
                    LeagueTypeName = x.LeagueType.Name,
                    Clinics = x.Clinics.Select(x => new BaseClinicModel { Id = x.ClinicId, Name = x.Clinic.Name}).ToList()
                })
                .ToList();

            return leagues;
        }

        public LeagueWithRankingsModel GetLeague(Guid leagueId, DateTime startDate, DateTime endDate)
        {
            var league = _leagueRepo.GetAll()
                .Where(x => x.Id == leagueId)
                .Select(x => new LeagueWithRankingsModel
                {
                    Id = x.Id,
                    InsertedDate = x.InsertedDate,
                    LeagueTypeId = x.LeagueTypeId,
                    LeagueTypeName = x.LeagueType.Name,
                    Name = x.Name
                })
                .FirstOrDefault();

            if (league == null)
            {
                return null;
            }

            league.Clinics = _pointsEngineService.GetLeagueRankings(leagueId, startDate, endDate);

            return league;
        }
    }
}
