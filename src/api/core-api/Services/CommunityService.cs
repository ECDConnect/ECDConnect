using EcdLink.Api.CoreApi.GraphApi.Models.Community;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution.Processing;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Runtime.Intrinsics.X86;

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
                ShareContactInfo = input.ShareContactInfo,
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
                return GetCommunityProfile(input.ToUserId);
            }
            return null;
        }

        public CommunityProfileModel GetCommunityProfile(Guid userId)
        {
            var allConnections = _communityProfileRepo.GetAll().Where(x => x.IsActive && x.ToUserId == userId).ToList();

            var userCommunityProfile = allConnections.Where(x => x.IsActive && x.ToUserId == userId).FirstOrDefault();
            if (userCommunityProfile != null )
            {
                var acceptedConnections = allConnections
                    .Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true)
                    .Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.ToUser).Result.ToList()))
                    .OrderByDescending(x => x.InsertedDate)
                    .ToList();
                var pendingConnections = allConnections
                    .Where(x => !x.InviteAccepted.HasValue && x.ToUserId != x.FromUserId)
                    .Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.ToUser).Result.ToList()))
                    .OrderByDescending(x => x.InsertedDate)
                    .ToList();


                // Users will always have 10% complete.
                var totalPoints = 10;
                // -Edit contact details -user saves form(note that they're not required to select any of the boxes) - 18 percentage points
                if (userCommunityProfile.ShareContactInfo.HasValue && userCommunityProfile.ShareContactInfo.Value)
                {
                    totalPoints += 18;
                }
                //- Edit basic info -user has filled in short description and province -18 percentage points
                if (!string.IsNullOrEmpty(userCommunityProfile.AboutShort) && userCommunityProfile.ProvinceId != null)
                {
                    totalPoints += 18;
                }
                //-About - user has filled in the field -18 percentage points
                if (!string.IsNullOrEmpty(userCommunityProfile.AboutLong))
                {
                    totalPoints += 18;
                }
                //-ECD skills - user has checked at least 1 skill - 18 percentage points
                if (userCommunityProfile.ProfileSkills.Count > 0)
                {
                    totalPoints += 18;
                }
                //-Photo - user has added a photo -18 percentage points
                if (!string.IsNullOrEmpty(userCommunityProfile.ToUser.ProfileImageUrl))
                {
                    totalPoints += 18;
                }
                // (61% or more = green; 11-60% = blue; 0-10% = amber)
                var completenessAvg = (decimal)totalPoints / 100 * 100;
                var completenessPerc = Math.Round(completenessAvg);
                var completenessPercColor = Constants.CSSColorClasses.Orange;
                var completenessPercImage = "need image names from FE";
                if (completenessPerc >= 61)
                {
                    completenessPercColor = Constants.CSSColorClasses.Green;
                    completenessPercImage = "ECD_Connect_emoji1.svg";
                } 
                else if (completenessPerc >= 11)
                {
                    completenessPercColor = Constants.CSSColorClasses.Blue;
                }

                return new CommunityProfileModel(userCommunityProfile, 
                                                 acceptedConnections, 
                                                 pendingConnections, 
                                                 _userManager.GetRolesAsync(userCommunityProfile.ToUser).Result.ToList(),
                                                 completenessPerc,
                                                 completenessPercColor,
                                                 completenessPercImage);
            }

            return null;
        }

        public List<CommunityConnectionModel> GetUsersToConnectWith(Guid? provinceId, Guid? communitySkillId, string connectionType, Guid userId)
        {
            var allConnections = _communityProfileRepo.GetAll().Where(x => x.IsActive && x.ToUserId != userId && x.FromUserId != userId).ToList();
            var filteredConnection = new List<CommunityProfile>();

            if (!string.IsNullOrEmpty(provinceId.ToString()))
            {
                filteredConnection.AddRange(allConnections.Where(x => x.ProvinceId == provinceId).ToList());
            }
            if (!string.IsNullOrEmpty(communitySkillId.ToString()))
            {
                // ProfileSkills
            }

            if (!string.IsNullOrEmpty(connectionType))
            {
                if (connectionType == "Connected")
                {
                    // Connected = people user currently connected with
                    filteredConnection.AddRange(allConnections.Where(x => x.ToUserId == userId && x.InviteAccepted.HasValue && x.InviteAccepted.Value).ToList());
                }
                else if (connectionType == "Received requests")
                {
                    // Received requests = all people who have sent the user a request and the user has not accepted yet, ie users with active requests
                    filteredConnection.AddRange(allConnections.Where(x => x.ToUserId == userId && !x.InviteAccepted.HasValue).ToList());
                }
                else if (connectionType == "Sent requests")
                {
                    // Sent requests = all people the user has sent requests to, who haven't accepted yet
                    filteredConnection.AddRange(allConnections.Where(x => x.FromUserId == userId && x.InviteAccepted.HasValue && !x.InviteAccepted.Value).ToList());
                }
            }

            if (provinceId != null || communitySkillId != null || connectionType != "")
            {
                return filteredConnection.Select(x => new CommunityConnectionModel(x, null)).ToList();
            }

            return allConnections.Select(x => new CommunityConnectionModel(x, null)).ToList();
        }

    }
}
