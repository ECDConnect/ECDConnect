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
using ECDLink.DataAccessLayer.Entities.Clinics;
using NPOI.SS.Formula.Functions;

namespace EcdLink.Api.CoreApi.Services
{
    public class LeagueService : ILeagueService
    {
        private IGenericRepository<League, Guid> _leagueRepo;
        private IGenericRepository<Clinic, Guid> _clinicRepo;
        private IGenericRepository<District, Guid> _districtRepo;
        private IGenericRepository<ClinicLeague, Guid> _clinicLeagueRepo;

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
            _clinicLeagueRepo = repoFactory.CreateRepository<ClinicLeague>(userContext: _uId);

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
                .Where(x => !x.Leagues.Any(x => x.IsActive && x.League.IsActive && x.League.StartDate == startDate && x.League.EndDate == endDate))
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
                    x.IsActive
                    && x.StartDate == startDate
                    && x.EndDate == endDate)
                .Select(x => new
                {
                    x.DistrictId,
                    LeagueTypeName = x.LeagueType.Name,
                    League = new LeagueWithClinicsModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Clinics = x.Clinics.Where(x => x.IsActive && x.Clinic.IsActive).Select(x => new SimpleClinicModel
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
            var startDate = GetCurrentSeasonStartDate();
            var endDate = GetCurrentSeasonEndDate();

            var leagues = _leagueRepo.GetAll(pagingInput)
                .Where(x => 
                    x.IsActive
                    && x.StartDate >= startDate 
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
                    Clinics = x.Clinics.Where(x => x.IsActive && x.Clinic.IsActive).Select(x => new BaseClinicModel { Id = x.ClinicId, Name = x.Clinic.Name}).ToList()
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

        public void DeleteLeague(Guid leagueId)
        {
            var league = _leagueRepo.GetById(leagueId);

            foreach (var clinicLeague in league.Clinics)
            {
                _clinicLeagueRepo.Delete(clinicLeague.Id);
            }

            _leagueRepo.Delete(leagueId);
        }

        public void AddClinicToLeague(Guid leagueId, Guid clinicId)
        {
            var startDate = GetCurrentSeasonStartDate();
            var endDate = GetCurrentSeasonEndDate();

            var league = _leagueRepo.GetById(leagueId);
            var clinic = _clinicRepo.GetById(clinicId);

            // Check clinic is not already in a league
            if (clinic.Leagues.Any(x => x.IsActive && x.League.StartDate >= startDate && x.League.EndDate <= endDate))
            {
                throw new ArgumentException("Clinic is already in a league");
            }

            // If league is a normal league with a district, validate all new clinics are in the same district
            if (league.DistrictId != null && clinic.SubDistrict.DistrictId != league.DistrictId)
            {
                throw new ArgumentException("Some new clinics are not in the correct district");
            }

            _clinicLeagueRepo.Insert(new ClinicLeague
            {
                IsActive = true,
                LeagueId = leagueId,
                ClinicId = clinicId,
                TenantId = Constants.Tenants.GrowGreatTenantId,
            });
        }

        public void EditLeague(Guid leagueId, string name, List<Guid> clinicsToAdd, List<Guid> clinicsToRemove)
        {
            var league = _leagueRepo.GetById(leagueId);

            if (!string.IsNullOrWhiteSpace(name))
            {
                league.Name = name;
            }

            // Remove clinics
            if (clinicsToRemove != null && clinicsToRemove.Any())
            {
                league.Clinics = league.Clinics.Where(x => !clinicsToRemove.Contains(x.ClinicId)).ToList();
            }

            // Add clinics
            if (clinicsToAdd != null && clinicsToAdd.Any())
            {
                // If league is a normal league with a district, validate all new clinics are in the same district
                if (league.DistrictId != null)
                {
                    if (_clinicRepo.GetAll().Where(x => clinicsToAdd.Contains(x.Id) && x.SubDistrict.DistrictId != league.DistrictId).Any())
                    {
                        throw new ArgumentException("Some new clinics are not in the correct district");
                    }
                }

                var startDate = GetCurrentSeasonStartDate();
                var endDate = GetCurrentSeasonEndDate();

                foreach (var clinicId in clinicsToAdd)
                {
                    if (_clinicLeagueRepo.GetAll().Any(x => x.ClinicId == clinicId && x.IsActive && x.League.StartDate == startDate && x.League.EndDate == endDate))
                    {
                        throw new ArgumentException("Clinic is already in a league");
                    }

                    league.Clinics.Add(new ClinicLeague
                    {
                        IsActive = true,
                        LeagueId = leagueId,
                        ClinicId = clinicId,
                        TenantId = Constants.Tenants.GrowGreatTenantId,
                    });
                }
            }

            _leagueRepo.Update(league);
        }

        private DateTime GetCurrentSeasonStartDate()
        {
            return DateTime.Now.Month > 9 ? new DateTime(DateTime.Now.Year, 10, 1) : new DateTime(DateTime.Now.Year - 1, 10, 1);
        }

        private DateTime GetCurrentSeasonEndDate()
        {
            return DateTime.Now.Month > 9 ? new DateTime(DateTime.Now.Year + 1, 10, 1) : new DateTime(DateTime.Now.Year, 10, 1);
        }
    }
}
