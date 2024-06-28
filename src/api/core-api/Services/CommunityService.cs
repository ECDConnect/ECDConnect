using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class CommunityService : Interfaces.ICommunityService
    {
        private IGenericRepository<SupportRating, Guid> _supportRatingRepo;
        private IGenericRepository<FeedbackType, Guid> _feedbackTypeRepo;
        private IGenericRepository<CommunitySkill, Guid> _communitySkillRepo;
        private IGenericRepository<CoachFeedback, Guid> _coachFeedbackRepo;
        private IGenericRepository<CommunityProfileSkill, Guid> _communityProfileSkillRepo;
        private IGenericRepository<CommunityProfile, Guid> _communityProfileRepo;

        private readonly AuthenticationDbContext _dbContext;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly INotificationService _notificationService;
        private readonly Guid? _applicationUserId;
        private readonly ApplicationUserManager _userManager;


        public CommunityService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] AuthenticationDbContext dbContext,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager
            )
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());

            _supportRatingRepo = repoFactory.CreateGenericRepository<SupportRating>(userContext: _applicationUserId);
            _feedbackTypeRepo = repoFactory.CreateGenericRepository<FeedbackType>(userContext: _applicationUserId);
            _communitySkillRepo = repoFactory.CreateGenericRepository<CommunitySkill>(userContext: _applicationUserId);
            _coachFeedbackRepo = repoFactory.CreateGenericRepository<CoachFeedback>(userContext: _applicationUserId);
            _communityProfileSkillRepo = repoFactory.CreateGenericRepository<CommunityProfileSkill>(userContext: _applicationUserId);
            _communityProfileRepo = repoFactory.CreateGenericRepository<CommunityProfile>(userContext: _applicationUserId);

            _dbContext = dbContext;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        public List<SupportRatingModel> GetSupportRatings()
        {
            return _supportRatingRepo.GetAll().Where(x => x.IsActive).Select(x => new SupportRatingModel(x)).OrderBy(x => x.Ordering).ToList();
        }
        public List<FeedbackTypeModel> GetFeedbackTypes()
        {
            return _feedbackTypeRepo.GetAll().Where(x => x.IsActive).Select(x => new FeedbackTypeModel(x)).OrderBy(x => x.Ordering).ToList();
        }
        public List<CommunitySkillModel> GetCommunitySkills()
        {
            return _communitySkillRepo.GetAll().Where(x => x.IsActive).Select(x => new CommunitySkillModel(x)).OrderBy(x => x.Ordering).ToList();
        }
        public CoachFeedback SaveCoachFeedback(CoachFeedbackInputModel input)
        {
            var coachFeedback = _coachFeedbackRepo.Insert(new CoachFeedback()
            {
                Id = Guid.NewGuid(),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                IsActive = true,
                FromUserId = input.FromUserId,
                ToUserId = input.ToUserId,
                FeedbackTypeId = input.FeedbackTypeId,
                SupportRatingId = input.SupportRatingId,
                FeedbackDetails = input.FeedbackDetails,
            });

            if (coachFeedback != null )
            {
                var userToSend = _userManager.FindByIdAsync(_hierarchyEngine.GetAdminUserId()).Result;
                var coach = _userManager.FindByIdAsync(coachFeedback.ToUserId).Result;

                List<TagsReplacements> replacements = new List<TagsReplacements>()
                {
                    new TagsReplacements()
                    {
                        FindValue = "FirstName",
                        ReplacementValue = coach.FullName
                    },
                    new TagsReplacements()
                    {
                        FindValue = "OrganisationName",
                        ReplacementValue = TenantExecutionContext.Tenant.OrganisationName
                    }
                };
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.NotifyAdminOnCoachFeedback, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements);
            }

            return coachFeedback;
        }

        public CommunityProfileModel SaveCommunityProfile(CommunityProfileInputModel input)
        {
            var communityProfile = _communityProfileRepo.Insert(new CommunityProfile()
            {
                Id = Guid.NewGuid(),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                IsActive = true,
                FromUserId = input.FromUserId,
                ToUserId = input.ToUserId,
                AboutShort = input.AboutShort,
                AboutLong = input.AboutLong,
                ShareEmail = input.ShareEmail,
                SharePhoneNumber = input.SharePhoneNumber,
                ShareProfilePhoto = input.ShareProfilePhoto,
                ShareProvince = input.ShareProvince,
                ShareRole = input.ShareRole,
                ProvinceId = input.ProvinceId,
                InviteAccepted = input.InviteAccepted,
            });

            if (communityProfile != null )
            {
                return GetCommunityProfile(input.FromUserId);
            }
            return null;
        }

        public CommunityProfileModel GetCommunityProfile(Guid userId)
        {
            var allConnections = _communityProfileRepo.GetAll().Where(x => x.IsActive && x.FromUserId == userId).ToList();

            var userCommunityProfile = allConnections.Where(x => x.IsActive && x.ToUserId == userId).FirstOrDefault();
            if (userCommunityProfile != null )
            {
                var acceptedConnections = allConnections
                    .Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true && x.ToUserId != userId)
                    .Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.ToUser).Result.ToList()) )
                    .ToList();
                var pendingConnections = allConnections
                    .Where(x => !x.InviteAccepted.HasValue && x.ToUserId != userId)
                    .Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.ToUser).Result.ToList()))
                    .ToList();

                return new CommunityProfileModel(userCommunityProfile, acceptedConnections, pendingConnections, _userManager.GetRolesAsync(userCommunityProfile.ToUser).Result.ToList());
            }

            return null;
        }

    }
}
