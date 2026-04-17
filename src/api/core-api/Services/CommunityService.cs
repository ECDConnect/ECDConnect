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
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class CommunityService : Interfaces.ICommunityService
    {
        private IGenericRepository<SupportRating, Guid> _supportRatingRepo;
        private IGenericRepository<FeedbackType, Guid> _feedbackTypeRepo;
        private IGenericRepository<CommunitySkill, Guid> _communitySkillRepo;
        private IGenericRepository<CoachFeedback, Guid> _coachFeedbackRepo;
        private IGenericRepository<CoachFeedbackType, Guid> _coachFeedbackTypeRepo;
        private IGenericRepository<CommunityProfileSkill, Guid> _communityProfileSkillRepo;
        private IGenericRepository<CommunityProfile, Guid> _communityProfileRepo;
        private IGenericRepository<CommunityProfileConnection, Guid> _communityProfileConnectionRepo;

        private readonly HierarchyEngine _hierarchyEngine;
        private readonly INotificationService _notificationService;
        private readonly Guid? _applicationUserId;
        private readonly ApplicationUserManager _userManager;
        private readonly IPointsEngineService _pointsService;

        public CommunityService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] AuthenticationDbContext dbContext,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            [Service] IPointsEngineService pointsService
            )
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());

            _supportRatingRepo = repoFactory.CreateRepository<SupportRating>(userContext: _applicationUserId);
            _feedbackTypeRepo = repoFactory.CreateRepository<FeedbackType>(userContext: _applicationUserId);
            _communitySkillRepo = repoFactory.CreateRepository<CommunitySkill>(userContext: _applicationUserId);
            _coachFeedbackRepo = repoFactory.CreateRepository<CoachFeedback>(userContext: _applicationUserId);
            _coachFeedbackTypeRepo = repoFactory.CreateRepository<CoachFeedbackType>(userContext: _applicationUserId);
            _communityProfileSkillRepo = repoFactory.CreateRepository<CommunityProfileSkill>(userContext: _applicationUserId);
            _communityProfileRepo = repoFactory.CreateRepository<CommunityProfile>(userContext: _applicationUserId);
            _communityProfileConnectionRepo = repoFactory.CreateRepository<CommunityProfileConnection>(userContext: _applicationUserId);

            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
            _pointsService = pointsService;
        }

        public List<SupportRatingModel> GetSupportRatings()
        {
            var result = _supportRatingRepo.GetAll().Where(x => x.IsActive).OrderBy(x => x.Ordering).ToList();
            return result.Select(x => new SupportRatingModel(x)).ToList();
        }
        public List<FeedbackTypeModel> GetFeedbackTypes()
        {
            var result = _feedbackTypeRepo.GetAll().Where(x => x.IsActive).OrderBy(x => x.Ordering).ToList();
            return result.Select(x => new FeedbackTypeModel(x)).ToList();
        }
        public List<CommunitySkillModel> GetCommunitySkills()
        {
            var result = _communitySkillRepo.GetAll().Where(x => x.IsActive).OrderBy(x => x.Ordering).ToList();
            return result.Select(x => new CommunitySkillModel(x)).ToList();
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
                SupportRatingId = input.SupportRatingId,
                FeedbackDetails = input.FeedbackDetails,
            });

            if (coachFeedback != null )
            {
                List<String> feedbackTypes = new List<String>();
                var coachFeedBackTypes = new List<CoachFeedbackType>();
                if (input.FeedbackTypeIds.Count > 0)
                {
                    foreach (var item in input.FeedbackTypeIds)
                    {
                        coachFeedBackTypes.Add(new CoachFeedbackType()
                        {
                            Id = Guid.NewGuid(),
                            InsertedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            UpdatedBy = _applicationUserId.ToString(),
                            IsActive = true,
                            CoachFeedbackId = coachFeedback.Id,
                            FeedbackTypeId = item
                        });
                        feedbackTypes.Add(_feedbackTypeRepo.GetAll().Where(x => x.Id == item).FirstOrDefault().Name + " ");
                    }
                    _coachFeedbackTypeRepo.InsertMany(coachFeedBackTypes);
                }

                var supportRating = _supportRatingRepo.GetAll().Where(x => x.Id == input.SupportRatingId).FirstOrDefault();
                var practitioner = _userManager.FindByIdAsync(_applicationUserId).Result;
                var coach = _userManager.FindByIdAsync(coachFeedback.ToUserId).Result;
                var adminUsers = _userManager.GetUsersInRoleAsync(Roles.ADMINISTRATOR).Result;

                List<TagsReplacements> replacements = new List<TagsReplacements>()
                {
                    new TagsReplacements() { FindValue = "UserFullName", ReplacementValue = practitioner.FullName },
                    new TagsReplacements() { FindValue = "Username", ReplacementValue = practitioner.UserName },
                    new TagsReplacements() { FindValue = "DateSubmitted", ReplacementValue = DateTime.Now.ToString("dd", CultureInfo.InvariantCulture) + " " + DateTime.Now.ToString("MMMM", CultureInfo.InvariantCulture) + " " + DateTime.Now.ToString("yyyy", CultureInfo.InvariantCulture) },
                    new TagsReplacements() { FindValue = "CoachFullName", ReplacementValue = coach.FullName },
                    new TagsReplacements() { FindValue = "CoachUserName", ReplacementValue = coach.UserName },
                    new TagsReplacements() { FindValue = "Feelings", ReplacementValue = supportRating.Name },
                    new TagsReplacements() { FindValue = "FeedbackList", ReplacementValue = feedbackTypes.ToString() },
                    new TagsReplacements() { FindValue = "Details", ReplacementValue = input.FeedbackDetails }
                };

                foreach (var user in adminUsers)
                {
                    _notificationService.SendNotificationAsync(null, TemplateTypeConstants.NotifyAdminOnCoachFeedback, DateTime.Now.Date, user, "", MessageStatusConstants.Blue, replacements, null, false, true, null,
                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(coachFeedback.Id, "CoachFeedback") });
                }
            }
            else
            {
                return null;
            }

            return coachFeedback;
        }

        public CommunityProfileModel SaveCommunityProfile(CommunityProfileInputModel input)
        {
            // first validate to see if there is maybe an archived profile for this user.
            var communityProfile = _communityProfileRepo.GetAll().Where(x => x.UserId == input.UserId).FirstOrDefault();
            
            if (communityProfile != null)
            {
                // if the profile exists and the about short is empty, we can add 
                if (string.IsNullOrEmpty(communityProfile.AboutShort) && !string.IsNullOrEmpty(input.AboutShort))
                {
                    _pointsService.CalculateAddingShortDescription(input.UserId);
                }

                communityProfile.IsActive = true;
                communityProfile.UserId = input.UserId;
                communityProfile.AboutShort = input.AboutShort;
                communityProfile.AboutLong = input.AboutLong;
                communityProfile.ShareContactInfo = input.ShareContactInfo;
                communityProfile.ShareEmail = input.ShareEmail;
                communityProfile.SharePhoneNumber = input.SharePhoneNumber;
                communityProfile.ShareProfilePhoto = input.ShareProfilePhoto;
                communityProfile.ShareProvince = input.ShareProvince;
                communityProfile.ShareRole = input.ShareRole;
                communityProfile.ProvinceId = string.IsNullOrWhiteSpace(input.ProvinceId.ToString()) ? null : input.ProvinceId;

                _communityProfileRepo.Update(communityProfile);
            } 
            else
            {
                communityProfile = _communityProfileRepo.Insert(new CommunityProfile()
                {
                    Id = Guid.NewGuid(),
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId.ToString(),
                    IsActive = true,
                    UserId = input.UserId,
                    AboutShort = input.AboutShort,
                    AboutLong = input.AboutLong,
                    ShareContactInfo = input.ShareContactInfo,
                    ShareEmail = input.ShareEmail,
                    SharePhoneNumber = input.SharePhoneNumber,
                    ShareProfilePhoto = input.ShareProfilePhoto,
                    ShareProvince = input.ShareProvince,
                    ShareRole = input.ShareRole,
                    ProvinceId = string.IsNullOrWhiteSpace(input.ProvinceId.ToString()) ? null : input.ProvinceId
                });

                // When communityProfile is added and there is a short description, add points
                if (!string.IsNullOrEmpty(input.AboutShort))
                {
                    _pointsService.CalculateAddingShortDescription(input.UserId);
                }
               
            }
            // Update skills if available
            UpdateProfileSkills(communityProfile.Id, input.CommunitySkillIds);

            _pointsService.CalculateCompleteCommunityProfile(input.UserId);

            return GetCommunityProfile();
        }

        public void UpdateProfileSkills(Guid communityProfileId, List<Guid> communitySkillIds)
        {

            var linkedSkills = _communityProfileSkillRepo.GetAll().Where(x => x.CommunityProfileId == communityProfileId).ToList();
            var linkedSkillIds = linkedSkills.Select(x => x.CommunitySkillId).ToList();

            if (linkedSkills.Count > 0 )
            {
                
                foreach (var item in linkedSkills)
                {
                    _communityProfileSkillRepo.Delete(item.Id);
                }

                var skillsToAdd = new List<CommunityProfileSkill>();
                foreach (var itemId in communitySkillIds)
                {
                    var skill = linkedSkills.Where(x => x.CommunitySkillId == itemId).FirstOrDefault();
                    if (skill != null)
                    {
                        skill.IsActive = true;
                        skill.UpdatedDate = DateTime.UtcNow;
                        skill.UpdatedBy = _applicationUserId.ToString();
                        _communityProfileSkillRepo.Update(skill);

                    } 
                    else
                    {
                        skillsToAdd.Add(new CommunityProfileSkill()
                        {
                            Id = Guid.NewGuid(),
                            InsertedDate = DateTime.UtcNow,
                            UpdatedBy = _applicationUserId.ToString(),
                            CommunityProfileId = communityProfileId,
                            CommunitySkillId = itemId,
                            IsActive = true
                        });
                    }
                }
                if (skillsToAdd.Count > 0)
                {
                    _communityProfileSkillRepo.InsertMany(skillsToAdd);
                }
            } 
            else
            {
                var skillsToAdd = new List<CommunityProfileSkill>();
                foreach (var item in communitySkillIds)
                {
                    skillsToAdd.Add(new CommunityProfileSkill()
                    {
                        Id = Guid.NewGuid(),
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId.ToString(),
                        CommunityProfileId = communityProfileId,
                        CommunitySkillId = item
                    });
                }
                if (skillsToAdd.Count > 0)
                {
                    _communityProfileSkillRepo.InsertMany(skillsToAdd);
                }
            }
        }

        public CommunityProfileModel GetCommunityProfile()
        {
            var userId = _applicationUserId;
            var userCommunityProfile = _communityProfileRepo.GetAll()
                                        .Include(x => x.User)
                                        .Include(x => x.ProfileSkills)
                                        .ThenInclude(x => x.CommunitySkill)
                                        .Where(x => x.UserId == userId).FirstOrDefault();

            if (userCommunityProfile != null )
            {
                DateTime? lastViewed = DateTime.Now.AddDays(-60);

                var allConnections = _communityProfileConnectionRepo
                                    .GetAll()
                                    .Where(x => x.IsActive && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId))
                                    .ToList();

                var fromConnections = allConnections.Where(x => x.FromProfile.UserId == userId).ToList();
                var toConnections = allConnections.Where(x => x.ToProfile.UserId == userId && x.FromProfile.UserId != userId ).ToList();

                if (userCommunityProfile?.User?.practitionerObjectData?.CommunitySectionViewDate != null)
                {
                    lastViewed = userCommunityProfile?.User?.practitionerObjectData?.CommunitySectionViewDate;
                }

                // connections that was send to this user and from this user and were accepted
                var acceptedConnections = toConnections
                     .Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true)
                     .Select(x => new CommunityConnectionModel(x.FromProfile, _userManager.GetRolesAsync(x.FromProfile.User).Result.ToList(), x.InviteAccepted))
                     .OrderByDescending(x => x.InsertedDate)
                     .ToList();
                 acceptedConnections.AddRange(fromConnections
                     .Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true)
                     .Select(x => new CommunityConnectionModel(x.ToProfile, _userManager.GetRolesAsync(x.ToProfile.User).Result.ToList(), x.InviteAccepted))
                     .OrderByDescending(x => x.InsertedDate)
                     .ToList());

                // new connections was send to this user and is still waiting for acceptance
                var pendingConnections = toConnections
                    .Where(x => !x.InviteAccepted.HasValue && x.InsertedDate.Date >= lastViewed.Value.Date)
                    .Select(x => new CommunityConnectionModel(x.FromProfile, _userManager.GetRolesAsync(x.FromProfile.User).Result.ToList(), x.InviteAccepted))
                    .OrderByDescending(x => x.InsertedDate)
                    .ToList();

                // showing all from this connections 
                var userConnectionsRequests = fromConnections
                    .Where(x => x.IsActive && !x.InviteAccepted.HasValue)
                    .Select(x => new CommunityConnectionModel(x.ToProfile, _userManager.GetRolesAsync(x.ToProfile.User).Result.ToList(), x.InviteAccepted))
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
                if (!string.IsNullOrEmpty(userCommunityProfile.User.ProfileImageUrl))
                {
                    totalPoints += 18;
                }
                // (61% or more = green; 11-60% = blue; 0-10% = amber)
                var completenessAvg = (decimal)totalPoints / 100 * 100;
                var completenessPerc = Math.Round(completenessAvg);
                var completenessPercColor = Constants.CSSColorClasses.Orange;
                if (completenessPerc >= 61)
                {
                    completenessPercColor = Constants.CSSColorClasses.Green;
                } 
                else if (completenessPerc >= 11)
                {
                    completenessPercColor = Constants.CSSColorClasses.Blue;
                }

                return new CommunityProfileModel(userCommunityProfile, 
                                                 acceptedConnections,
                                                 pendingConnections,
                                                 userConnectionsRequests,
                                                 _userManager.GetRolesAsync(userCommunityProfile.User).Result.ToList(),
                                                 completenessPerc,
                                                 completenessPercColor);
            } 
            else
            {
                return null;
            }
        }

        public List<CommunityConnectionModel> GetUsersToConnectWith(
            List<Guid> provinceIds = null, 
            List<Guid> communitySkillIds = null, 
            List<string> connectionTypes = null)
        {
            var userId = _applicationUserId;
            // Early exit if no filters and we can return everything
            bool hasProvinceFilter = provinceIds?.Any() == true;
            bool hasSkillFilter = communitySkillIds?.Any() == true;
            bool hasConnectionFilter = connectionTypes?.Any() == true;

            // 1. Get all active profiles (excluding current user)
            var allCommunityProfiles = _communityProfileRepo.GetAll()
                .Where(x => x.IsActive 
                        && x.ShareContactInfo == true 
                        && x.UserId != userId)
                .AsNoTracking()
                .ToList(); // Materialize once

            // 2. Get all relevant connections for the current user (materialize once)
            var userConnections = _communityProfileConnectionRepo.GetAll()
                .Where(x => x.IsActive 
                        && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId))
                .AsNoTracking()
                .ToList();

            // 3. Build connection status dictionary
            var connectionsDict = userConnections
                .Where(x => x.FromProfile.UserId == userId)
                .ToDictionary(
                    x => x.ToCommunityProfileId, 
                    x => x.InviteAccepted == true
                );

            // 4. Start with base set and apply filters
            IEnumerable<CommunityProfile> filteredProfiles = allCommunityProfiles;

            // Province Filter
            if (hasProvinceFilter)
            {
                var provinceSet = new HashSet<Guid>(provinceIds);
                filteredProfiles = filteredProfiles
                    .Where(x => x.ProvinceId.HasValue && provinceSet.Contains(x.ProvinceId.Value));
            }

            // Skill Filter
            if (hasSkillFilter)
            {
                var skillSet = new HashSet<Guid>(communitySkillIds);

                filteredProfiles = filteredProfiles
                    .Where(profile => profile.ProfileSkills
                        .Any(skill => skillSet.Contains(skill.CommunitySkillId)));
            }

            // Connection Type Filters
            if (hasConnectionFilter)
            {
                var resultFromConnectionFilter = new List<CommunityProfile>();

                var fromConnections = userConnections.Where(x => x.FromProfile.UserId == userId).ToList();
                var toConnections = userConnections.Where(x => x.ToProfile.UserId == userId).ToList();

                if (connectionTypes.Contains("Connected"))
                {
                    resultFromConnectionFilter.AddRange(
                        toConnections
                            .Where(x => x.InviteAccepted == true)
                            .Select(x => x.FromProfile));

                    resultFromConnectionFilter.AddRange(
                        fromConnections
                            .Where(x => x.InviteAccepted == true)
                            .Select(x => x.ToProfile));
                }

                if (connectionTypes.Contains("Received requests"))
                {
                    resultFromConnectionFilter.AddRange(
                        toConnections
                            .Where(x => x.InviteAccepted == null)
                            .Select(x => x.FromProfile));
                }

                if (connectionTypes.Contains("Sent requests"))
                {
                    resultFromConnectionFilter.AddRange(
                        fromConnections
                            .Where(x => x.InviteAccepted == null)
                            .Select(x => x.ToProfile));
                }

                filteredProfiles = resultFromConnectionFilter;
            }

            return filteredProfiles
                .Distinct()
                .Select(profile => new CommunityConnectionModel(
                    profile,
                    _userManager.GetRolesAsync(profile.User).Result.ToList(), 
                    connectionsDict.TryGetValue(profile.Id, out bool isAccepted) ? isAccepted : null
                ))
                .ToList();
        }

        public CommunityProfileModel AcceptRejectCommunityRequests(AcceptRejectCommunityRequestsInputModel input)
        {
            if (input.UserIdsToAccept != null && input.UserIdsToAccept.Any())
            {
                var accepted = _communityProfileConnectionRepo.GetAll()
                                .Where(x => x.IsActive && x.ToProfile.UserId == input.UserId && input.UserIdsToAccept.Contains((Guid)x.FromProfile.UserId))
                                .AsNoTracking()
                                .ToList();
                foreach (var item in accepted)
                {
                    item.InviteAccepted = true;
                    item.UpdatedDate = DateTime.Now;
                    item.UpdatedBy = _applicationUserId.ToString();
                    _communityProfileConnectionRepo.Update(item);

                }
                var pointUserIds = accepted.Select(x => (Guid)x.FromProfile.UserId).Distinct().ToList();
                pointUserIds.AddRange(accepted.Select(x => (Guid)x.ToProfile.UserId).Distinct().ToList());
                foreach (var item in pointUserIds)
                {
                    _pointsService.CalculateConnectWithAnotherUser(item);

                }
            }
            if (input.UserIdsToReject != null && input.UserIdsToReject.Any())
            {
                var rejected = _communityProfileConnectionRepo.GetAll()
                                .Where(x => x.IsActive && x.ToProfile.UserId == input.UserId && input.UserIdsToReject.Contains((Guid)x.FromProfile.UserId))
                                .AsNoTracking()
                                .ToList();
                foreach (var item in rejected)
                {
                    item.InviteAccepted = false;
                    item.IsActive = false;
                    item.UpdatedDate = DateTime.Now;
                    item.UpdatedBy = _applicationUserId.ToString();
                    _communityProfileConnectionRepo.Update(item);
                }
            }
            _notificationService.ExpireNotificationsTypesForUser(input.UserId.ToString(), TemplateTypeConstants.OpenCommunityConnections);
            return GetCommunityProfile();
        }

        public bool DeleteCommunityProfile(Guid communityProfileId)
        {
            _communityProfileRepo.Delete(communityProfileId);
            return true;
        }

        public List<CommunityProfileConnection> SaveCommunityProfileConnections(List<CommunityConnectInputModel> input)
        {
            var allConnections = _communityProfileConnectionRepo.GetAll().Where(x => x.IsActive);
            var newConnections = new List<CommunityProfileConnection>();
            foreach (var item in input)
            {
                var connection = allConnections.Where(x => x.FromCommunityProfileId == item.FromCommunityProfileId && x.ToCommunityProfileId == item.ToCommunityProfileId).FirstOrDefault();
                if (connection == null)
                {
                    newConnections.Add(new CommunityProfileConnection()
                    {
                        Id = Guid.NewGuid(),
                        InsertedDate = DateTime.Now,
                        FromCommunityProfileId = item.FromCommunityProfileId,
                        ToCommunityProfileId = item.ToCommunityProfileId,
                        InviteAccepted = null
                    });
                }
            }
            if (newConnections.Count > 0)
            {
                return (List<CommunityProfileConnection>)_communityProfileConnectionRepo.InsertMany(newConnections);
            }

            return null;
        }

        public CommunityProfileConnection CancelCommunityRequest(CommunityConnectInputModel input)
        {
            var connectionRequest = _communityProfileConnectionRepo.GetAll()
                                        .Where(x => x.IsActive && x.FromCommunityProfileId == input.FromCommunityProfileId && x.ToCommunityProfileId == input.ToCommunityProfileId)
                                        .OrderByDescending(x => x.InsertedDate)
                                        .FirstOrDefault();
            if (connectionRequest != null)
            {
                connectionRequest.InviteAccepted = false;
                connectionRequest.IsActive = false;
                connectionRequest.UpdatedDate = DateTime.Now;
                connectionRequest.UpdatedBy = _applicationUserId.ToString();
                _communityProfileConnectionRepo.Update(connectionRequest);
                return connectionRequest;
            }
            return null;
        }

        public List<CommunityConnectionModel> GetOtherConnections(
            List<Guid> provinceIds = null,
            List<Guid> communitySkillIds = null)
        {
            var userId = _applicationUserId;

            // Single query to get all connected profile IDs
            var connectedProfileIds = _communityProfileConnectionRepo.GetAll()
                .Where(x => x.IsActive && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId)).AsNoTracking()
                .Select(x => x.FromProfile.UserId == userId ? x.ToCommunityProfileId : x.FromCommunityProfileId)
                .Distinct()
                .ToHashSet();

            // Convert filter lists to HashSets once, upfront
            var provinceIdSet = provinceIds?.Count > 0 ? provinceIds.ToHashSet() : null;
            var skillIdSet = communitySkillIds?.Count > 0 ? communitySkillIds.ToHashSet() : null;

            bool hasProvinceFilter = provinceIdSet != null;
            bool hasSkillFilter = skillIdSet != null;

            var profilesQuery = _communityProfileRepo.GetAll()
                .Where(x => x.IsActive
                        && x.ShareContactInfo == true
                        && x.UserId != userId
                        && !connectedProfileIds.Contains(x.Id)).AsNoTracking();

            // Push filters down to the DB query where possible
            if (hasProvinceFilter && !hasSkillFilter)
                profilesQuery = profilesQuery.Where(x => x.ProvinceId.HasValue && provinceIdSet.Contains(x.ProvinceId.Value));

            var profiles = profilesQuery.Distinct().ToList();

            // Apply in-memory skill filter (requires navigation property)
            IEnumerable<CommunityProfile> filteredProfiles = profiles;

            if (hasProvinceFilter && hasSkillFilter)
            {
                // Both filters: union of province matches OR skill matches
                filteredProfiles = profiles.Where(x =>
                    (x.ProvinceId.HasValue && provinceIdSet.Contains(x.ProvinceId.Value)) ||
                    x.ProfileSkills.Any(s => skillIdSet.Contains(s.CommunitySkillId)));
            }
            else if (hasSkillFilter)
            {
                filteredProfiles = profiles.Where(x =>
                    x.ProfileSkills.Any(s => skillIdSet.Contains(s.CommunitySkillId)));
            }

            // Deduplicate and project — avoid blocking .Result by noting async refactor is recommended
            return filteredProfiles
                .DistinctBy(x => x.Id)
                .Select(x => new CommunityConnectionModel(
                    x,
                    _userManager.GetRolesAsync(x.User).Result.ToList(),
                    null))
                .ToList();
        }

        public bool UpdateClickedECDHeros(Guid userId)
        {
            var recordToUpdate = _communityProfileRepo.GetByUserId(userId);
            if (recordToUpdate != null)
            {
                recordToUpdate.ClickedECDHeros = true;
                recordToUpdate.UpdatedDate = DateTime.Now;
                recordToUpdate.UpdatedBy = _applicationUserId.ToString();
                _communityProfileRepo.Update(recordToUpdate);
                return true;
            }
            return false;
        }

    }
}
