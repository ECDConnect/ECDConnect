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
using Microsoft.EntityFrameworkCore;
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

            _supportRatingRepo = repoFactory.CreateGenericRepository<SupportRating>(userContext: _applicationUserId);
            _feedbackTypeRepo = repoFactory.CreateGenericRepository<FeedbackType>(userContext: _applicationUserId);
            _communitySkillRepo = repoFactory.CreateGenericRepository<CommunitySkill>(userContext: _applicationUserId);
            _coachFeedbackRepo = repoFactory.CreateGenericRepository<CoachFeedback>(userContext: _applicationUserId);
            _coachFeedbackTypeRepo = repoFactory.CreateGenericRepository<CoachFeedbackType>(userContext: _applicationUserId);
            _communityProfileSkillRepo = repoFactory.CreateGenericRepository<CommunityProfileSkill>(userContext: _applicationUserId);
            _communityProfileRepo = repoFactory.CreateGenericRepository<CommunityProfile>(userContext: _applicationUserId);
            _communityProfileConnectionRepo = repoFactory.CreateGenericRepository<CommunityProfileConnection>(userContext: _applicationUserId);

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
                    }
                    _coachFeedbackTypeRepo.InsertMany(coachFeedBackTypes);
                }

                var userToSend = _userManager.FindByIdAsync(input.FromUserId).Result;
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

                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.NotifyAdminOnCoachFeedback, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, null, false, true, null,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(coachFeedback.Id, "CoachFeedback") });
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

            return GetCommunityProfile(input.UserId);
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

        public CommunityProfileModel GetCommunityProfile(Guid userId)
        {
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

                // if (totalPoints == 100)
                // {
                //     _pointsService.CalculateCompleteCommunityProfile(userId);
                // }

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

        public List<CommunityConnectionModel> GetUsersToConnectWith(Guid userId, List<Guid> provinceIds = null, List<Guid> communitySkillIds = null, List<string> connectionTypes = null)
        {
            var allCommunityProfiles = _communityProfileRepo.GetAll().Where(x => x.IsActive && x.ShareContactInfo.HasValue && x.ShareContactInfo.Value && x.UserId != userId).ToList();
            var allConnections = _communityProfileConnectionRepo
                                            .GetAll()
                                            .Where(x => x.IsActive && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId));
            
            var connectionsToBeAccepted = allConnections
                                            .Where(x => x.IsActive && x.FromProfile.UserId == userId)
                                            .Select(x => new { x.ToCommunityProfileId, x.InviteAccepted})
                                            .ToList();

            var connectionsDict = connectionsToBeAccepted.ToDictionary(x => x.ToCommunityProfileId, x => x.InviteAccepted);

            var filteredConnection = new List<CommunityProfile>();

            if (provinceIds != null && provinceIds.Any())
            {
                filteredConnection.AddRange(allCommunityProfiles.Where(x => x.ProvinceId.HasValue && provinceIds.Contains((Guid)x.ProvinceId.Value)).ToList());
            }
            if (communitySkillIds != null && communitySkillIds.Any())
            {
                foreach (var item in allCommunityProfiles)
                {
                    if (item.ProfileSkills.Any())
                    {
                        foreach (var skill in item.ProfileSkills)
                        {
                            if (communitySkillIds.Contains(skill.CommunitySkillId))
                            {
                                filteredConnection.Add(item);
                            }
                        }
                    }
                }
            }
            if (connectionTypes != null && connectionTypes.Any())
            {
                var fromConnections = allConnections.Where(x => x.FromProfile.UserId == userId).ToList();
                var toConnections = allConnections.Where(x => x.ToProfile.UserId == userId && x.FromProfile.UserId != userId).ToList();

                if (connectionTypes.Contains("Connected"))
                {
                    // Connected = people user currently connected with
                    filteredConnection.AddRange(toConnections.Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true).Select(x => x.FromProfile).ToList());
                    filteredConnection.AddRange(fromConnections.Where(x => x.InviteAccepted.HasValue && x.InviteAccepted == true).Select(x => x.ToProfile).ToList());
                }
                if (connectionTypes.Contains("Received requests"))
                {
                    // Received requests = all people who have sent the user a request and the user has not accepted yet, ie users with active requests
                    filteredConnection.AddRange(toConnections.Where(x => !x.InviteAccepted.HasValue).Select(x => x.FromProfile).ToList());
                }
                if (connectionTypes.Contains("Sent requests"))
                {
                    // Sent requests = all people the user has sent requests to, who haven't accepted yet
                    filteredConnection.AddRange(fromConnections.Where(x => x.IsActive && !x.InviteAccepted.HasValue).Select(x => x.ToProfile).ToList());
                }
            }

            if ((provinceIds != null && provinceIds.Any()) || (communitySkillIds != null && communitySkillIds.Any()) || (connectionTypes != null && connectionTypes.Any()))
            {
                return filteredConnection.Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.User).Result.ToList(), connectionsDict.ContainsKey(x.Id) ? connectionsDict[x.Id] == null? false: true  : null)).Distinct().ToList();
            }

            return allCommunityProfiles.Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.User).Result.ToList(), connectionsDict.ContainsKey(x.Id) ? connectionsDict[x.Id] == null ? false : true : null)).Distinct().ToList();
        }

        public CommunityProfileModel AcceptRejectCommunityRequests(AcceptRejectCommunityRequestsInputModel input)
        {
            if (input.UserIdsToAccept != null && input.UserIdsToAccept.Any())
            {
                var accepted = _communityProfileConnectionRepo.GetAll()
                                .Where(x => x.IsActive && x.ToProfile.UserId == input.UserId && input.UserIdsToAccept.Contains((Guid)x.FromProfile.UserId))
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
                var rejected = _communityProfileConnectionRepo.GetAll().Where(x => x.IsActive && x.ToProfile.UserId == input.UserId && input.UserIdsToReject.Contains((Guid)x.FromProfile.UserId)).ToList();
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
            return GetCommunityProfile(input.UserId);
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

        public List<CommunityConnectionModel> GetOtherConnections(Guid userId, List<Guid> provinceIds = null, List<Guid> communitySkillIds = null)
        {
            var allConnections = _communityProfileConnectionRepo.GetAll()
                                    .Where(x => x.IsActive && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId));

            var fromConnections = allConnections.Where(x => x.FromProfile.UserId == userId).Select(x => x.ToCommunityProfileId).Distinct().ToList();
            var toConnections = allConnections.Where(x => x.ToProfile.UserId == userId).Select(x => x.FromCommunityProfileId).Distinct().ToList();
            
            // exclude profiles where user is linked to any connection
            var allCommunityProfiles = _communityProfileRepo.GetAll().Where(x => x.IsActive && 
                                x.ShareContactInfo.HasValue && 
                                x.ShareContactInfo.Value && 
                                x.UserId != userId &&
                                !fromConnections.Contains(x.Id) &&
                                !toConnections.Contains(x.Id)
                                ).Distinct().ToList();


            var filteredConnection = new List<CommunityProfile>();

            if (provinceIds != null && provinceIds.Any())
            {
                filteredConnection.AddRange(allCommunityProfiles.Where(x => x.ProvinceId.HasValue && provinceIds.Contains(x.ProvinceId.Value)).Select(x => x).ToList());
            }

            if (communitySkillIds != null && communitySkillIds.Any())
            {
                foreach (var item in allCommunityProfiles)
                {
                    if (item.ProfileSkills.Any())
                    {
                        foreach (var skill in item.ProfileSkills)
                        {
                            if (communitySkillIds.Contains(skill.CommunitySkillId))
                            {
                                filteredConnection.Add(item);
                            }
                        }
                    }
                }
            }

            if ((provinceIds != null && provinceIds.Any()) || (communitySkillIds != null && communitySkillIds.Any()))
            {
                return filteredConnection.Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.User).Result.ToList(), null)).Distinct().ToList();
            }
            return allCommunityProfiles.Select(x => new CommunityConnectionModel(x, _userManager.GetRolesAsync(x.User).Result.ToList(), null)).Distinct().ToList();
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
