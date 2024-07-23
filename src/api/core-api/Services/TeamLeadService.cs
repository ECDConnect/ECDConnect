using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class TeamLeadService : ITeamLeadService
    {
        private IGenericRepository<ShortenUrlEntity, Guid> _shortenUrlEntityRepo;
        private IGenericRepository<TeamLead, Guid> _teamLeadRepo;

        private Guid _applicationUserId;


        public TeamLeadService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine)
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().Value);

            _shortenUrlEntityRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: _applicationUserId);
            _teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: _applicationUserId);
        }

        public PortalUsersTLModel GetTeamLeadById(Guid teamLeadId)
        {
            var teamLead = _teamLeadRepo.GetById(teamLeadId);

            // Get ids and tokens
            var invitation = _shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    x.UserId.Value == teamLead.UserId
                    && x.MessageType == TemplateTypeConstants.TeamLeadInvitation
                    && x.IsActive
                    && x.Clicked == 0)
                .OrderByDescending(x => x.InsertedDate)
                .FirstOrDefault();

            return new PortalUsersTLModel
            {
                Id = teamLead.Id,
                User = new PortalUserModel(teamLead.User, teamLead.IsRegistered, invitation != null ? invitation.InsertedDate : null),
                ClinicIds = teamLead.Clinics.Where(x => x.IsActive).Select(x => x.ClinicId).ToList(),
                ClinicNames = teamLead.Clinics.Where(x => x.IsActive).Select(x => x.Clinic.Name).ToList(),
                InsertedDate = teamLead.InsertedDate,
                IsRegistered = teamLead.IsRegistered,
                ProvinceIds = teamLead.Clinics.Where(x => x.IsActive && x.Clinic.SubDistrict != null).Select(x => x.Clinic.SubDistrict.District.ProvinceId).ToList(),
                SubDistrictIds = teamLead.Clinics.Where(x => x.IsActive && x.Clinic.SubDistrict != null).Select(x => (Guid)x.Clinic.SubDistrictId).ToList()
            };
        }
    }
}
