using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildTokenAccessMutation
    {
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;
        [TokenAccess(typeof(ChildOpenAccessValidator))]
        public async Task<bool> OpenAccessAddChild(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IPointsEngineService pointsEngineService,
            string token,
            AddChildCaregiverTokenModel caregiver,
            AddChildLearnerTokenModel learner,
            AddChildSiteAddressTokenModel siteAddress,
            AddChildTokenModel child)
        {
            var tokenModel = JsonConvert.DeserializeObject<ChildTokenWrapperModel>(TokenHelper.DecodeToken(token));

            var appUser = await tokenManager.GetValidUserWithTokenAsync(tokenModel.ChildUserId, tokenModel.Token);

            if (appUser == default(ApplicationUser))
            {
                // No user with the token. Cannot update
                return false;
            }

            using var scope = dbFactory.CreateDbContext();

            using var dbContextTransaction = scope.Database.BeginTransaction();
            using var siteRepo = repoFactory.CreateRepository<SiteAddress>(scope, tokenModel.AddedByUserId);
            using var caregiverRepo = repoFactory.CreateRepository<Caregiver>(scope, tokenModel.AddedByUserId);
            using var childRepo = repoFactory.CreateRepository<Child>(scope, tokenModel.AddedByUserId);

            try
            {
                var siteAddressEntity = AddSiteAddress(siteAddress, siteRepo);

                var caregiverEntity = AddCaregiver(caregiver, siteAddressEntity, caregiverRepo);

                var childEntity = AddChild(contextAccessor, child, tokenModel, caregiverEntity, childRepo);

                // Manage points for user
                pointsEngineService.AddChildrenRegistration(appUser.Id, DateTime.UtcNow);

                AddLearner(childEntity, learner, tokenModel, scope);

                appUser.UserName = appUser.Id;
                appUser.GenderId = child.GenderId;
                appUser.IsActive = true;
                appUser.DateOfBirth = child.DateOfBirth;
                appUser.IsSouthAfricanCitizen = child.IsSouthAfricanCitizen;
                appUser.RaceId = child.RaceId;
                appUser.VerifiedByHomeAffairs = child.VerifiedByHomeAffairs;

                await tokenManager.RetractTokensAsync(appUser);
                scope.SaveChanges();

                dbContextTransaction.Commit();
            }
            catch (Exception)
            {
                dbContextTransaction.Rollback();
                return false;
            }
            finally
            {
                dbContextTransaction.Dispose();
                siteRepo.Dispose();
                caregiverRepo.Dispose();
                childRepo.Dispose();
            }

            return true;
        }

        private SiteAddress AddSiteAddress(AddChildSiteAddressTokenModel siteAddress, IGenericRepository<SiteAddress, Guid> repoFactory)
        {
            var siteAddressEntity = new SiteAddress
            {
                AddressLine1 = siteAddress.AddressLine1,
                AddressLine2 = siteAddress.AddressLine2,
                AddressLine3 = siteAddress.AddressLine3,
                Name = siteAddress.Name,
                PostalCode = siteAddress.PostalCode,
                ProvinceId = siteAddress.ProvinceId,
                Ward = siteAddress.Ward
            };

            var updated = repoFactory.Insert(siteAddressEntity);

            return updated;
        }

        private void AddLearner(Child child, AddChildLearnerTokenModel learner, ChildTokenWrapperModel tokenModel, AuthenticationDbContext context)
        {
            context.Learners.Add(new Learner
            {
                Id = Guid.NewGuid(),
                ClassroomGroupId = tokenModel.ClassroomGroupId,
                ProgrammeAttendanceReasonId = learner.attendanceReasonId,
                OtherAttendanceReason = learner.otherAttendanceReason,
                UserId = tokenModel.ChildUserId,
                StartedAttendance = DateTime.Now,
                Hierarchy = child.Hierarchy
            });
        }

        private Caregiver AddCaregiver(AddChildCaregiverTokenModel caregiver, SiteAddress siteAddressEntity, IGenericRepository<Caregiver, Guid> repoFactory)
        {
            var caregiverEntity = new Caregiver
            {
                AdditionalFirstName = caregiver.AdditionalFirstName,
                AdditionalPhoneNumber = caregiver.AdditionalPhoneNumber,
                AdditionalSurname = caregiver.AdditionalSurname,
                Contribution = caregiver.Contribution,
                EducationId = caregiver.EducationId,
                EmergencyContactFirstName = caregiver.EmergencyContactFirstName,
                EmergencyContactPhoneNumber = caregiver.EmergencyContactPhoneNumber,
                EmergencyContactSurname = caregiver.EmergencyContactSurname,
                FirstName = caregiver.FirstName,
                FullName = $"{caregiver.FirstName} {caregiver.Surname}",
                Surname = caregiver.Surname,
                IdNumber = caregiver.IdNumber,
                IsActive = true,
                JoinReferencePanel = caregiver.JoinReferencePanel,
                PhoneNumber = caregiver.PhoneNumber,
                RelationId = caregiver.RelationId,
                SiteAddressId = siteAddressEntity.Id
            };

            var updated = repoFactory.Insert(caregiverEntity);

            return updated;
        }

        private Child AddChild([Service] IHttpContextAccessor contextAccessor, AddChildTokenModel child, ChildTokenWrapperModel tokenModel, Caregiver caregiver, IGenericRepository<Child, Guid> repoFactory)
        {
            // There may not be a logged in user if open access is used
            var insertingUsername = contextAccessor.HttpContext.GetUser()?.FullName ?? caregiver?.FullName;

            var childEntity = new Child
            {
                Id = tokenModel.ChildId,
                UserId = tokenModel.ChildUserId,
                Allergies = child.Allergies,
                Disabilities = child.Disabilities,
                LanguageId = child.LanguageId,
                OtherHealthConditions = child.OtherHealthConditions,
                WorkflowStatusId = child.WorkflowStatusId,
                CaregiverId = caregiver.Id,
                InsertedBy = !string.IsNullOrEmpty(insertingUsername) ? insertingUsername : "N/A"
            };

            var updated = repoFactory.Update(childEntity);

            return updated;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<string> GenerateCaregiverChildToken(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContext,
            string firstname,
            string surname,
            Guid classgroupId)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var appUser = new ApplicationUser
            {
                FirstName = firstname,
                Surname = surname,
                UserName = $"External_Edit_{Guid.NewGuid()}",
                IsImported = false
            };
            appUser.TenantId = tenantId;
            await userManager.CreateAsync(appUser);

            var childRepo = repoFactory.CreateRepository<Child>(userContext: httpContext.HttpContext.GetUser().Id);
            var workflowStatusRepo = repoFactory.CreateRepository<WorkflowStatus>(userContext: httpContext.HttpContext.GetUser().Id);
            var workflowStatus = workflowStatusRepo.GetAll().Where(x => x.EnumId == WorkflowStatusEnum.ChildExternalLink).OrderBy(x => x.Id).FirstOrDefault();

            var insertingUser = httpContext.HttpContext.GetUser().FullName;

            var child = new Child
            {
                UserId = appUser.Id,
                WorkflowStatusId = workflowStatus.Id,
                InsertedBy = !string.IsNullOrEmpty(insertingUser) ? insertingUser : "N/A"
            };

            child.TenantId = tenantId;
            var newChild = childRepo.Insert(child);

            var tokenWrapper = new ChildTokenWrapperModel
            {
                AddedByUserId = httpContext.HttpContext.GetUser().Id,
                ClassroomGroupId = classgroupId,
                Token = await tokenManager.GenerateTokenAsync(appUser),
                ChildId = newChild.Id,
                ChildUserId = appUser.Id
            };

            await userManager.AddToRoleAsync(appUser, "Child");

            return TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper));
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<string> RefreshCaregiverChildToken(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContext,
            Guid childId,
            Guid classgroupId)
        {
            if (childId == Guid.Empty)
                throw new QueryException($"{nameof(childId)} cannot be empty");

            var childRepo = repoFactory.CreateRepository<Child>(userContext: httpContext.HttpContext.GetUser().Id);
            var child = childRepo.GetById(childId);
            
            if (classgroupId == Guid.Empty)
            {
                var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: httpContext.HttpContext.GetUser().Id);
                var learner = learnerRepo.GetAll().Where(x => x.UserId == child.UserId)?.FirstOrDefault();
                classgroupId = learner.ClassroomGroupId;
            }

            if (child == default)
            {
                return string.Empty;
            }

            var appUser = await userManager.FindByIdAsync(child.UserId);

            if (appUser == default)
            {
                return string.Empty;
            }

            await tokenManager.RetractTokensAsync(appUser);

            var tokenWrapper = new ChildTokenWrapperModel
            {
                AddedByUserId = httpContext.HttpContext.GetUser().Id,
                ClassroomGroupId = classgroupId,
                Token = await tokenManager.GenerateTokenAsync(appUser),
                ChildId = child.Id,
                ChildUserId = appUser.Id
            };

            return TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper));
        }

        public bool UpdateCareGiverGrants(
  [Service] AuthenticationDbContext context,
   Guid childUserId,
  List<Guid> grantIds)
        {
            if (childUserId != null && grantIds != null)
            {
                //retrieve careGiverId from child
                var childObj = context.Children.Where(x => x.UserId == childUserId.ToString()).OrderBy(x => x.Id).FirstOrDefault();
                if (childObj != null)
                {
                    Guid? caregiverId = childObj.CaregiverId;
                    if (caregiverId != null)
                    {
                        var grantsToAdd = grantIds.Select(x => new UserGrant
                        {
                            GrantId = x,
                            UserId = caregiverId.ToString(),
                            TenantId = _tenantId
                        });

                        var existingGrants = context.UserGrants
                          .Where(x => x.UserId == caregiverId.ToString());

                        try
                        {
                            //remove
                            context.UserGrants.RemoveRange(existingGrants);
                            context.SaveChanges();
                            //reinsert
                            context.UserGrants.AddRange(grantsToAdd);
                            context.SaveChanges();
                            return true;
                        }
                        catch (Exception e)
                        {
                            // Error
                            return false;
                        }
                    }
                    else return false;
                }
                else return false;
            }
            else return false;
        }
    }
}
