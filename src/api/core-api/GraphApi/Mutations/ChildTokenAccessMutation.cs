using EcdLink.Api.CoreApi.GraphApi.AccessValidators;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Helpers;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildTokenAccessMutation
    {
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;

        /// <summary>
        /// Initially creates a child with basic details and generates token so a caregiver link can be created
        /// 
        /// Used by practitioner, to initiate the registration process
        /// </summary>
        /// <param name="firstname"></param>
        /// <param name="surname"></param>
        /// <param name="classgroupId"></param>
        /// <returns></returns>
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<InitialChildRegistrationModel> GenerateCaregiverChildToken(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] ISystemSetting<SecurityNotificationOptions> optionAccessor,
            [Service] ShortUrlManager shortUrlManager,
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContext,
            [Service] ApplicationUserManager userManager,
            string firstname,
            string surname,
            Guid classgroupId)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            var userId = httpContext.HttpContext.GetUser().Id;

            var workflowStatusRepo = repoFactory.CreateRepository<WorkflowStatus>(userContext: userId);
            var workflowStatus = workflowStatusRepo.GetAll().Where(x => x.EnumId == WorkflowStatusEnum.ChildExternalLink).OrderBy(x => x.Id).FirstOrDefault();
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);

            var classroomGroup = classroomGroupRepo.GetById(classgroupId);

            // Create these repos in the context of the class owner, so the hierarchy gets setup correctly
            var childRepo = repoFactory.CreateRepository<Child>(userContext: classroomGroup.UserId);
            var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: classroomGroup.UserId);

            var addedByUser = httpContext.HttpContext.GetUser();

            var user = new ApplicationUser
            {
                FirstName = firstname,
                Surname = surname,
                UserName = $"External_Edit_{Guid.NewGuid()}",
                IsImported = false,
                IsActive = true,
                TenantId = tenantId
            };

            await userManager.CreateAsync(user); 
            await userManager.AddToRoleAsync(user, "Child");

            var child = new Child
            {
                WorkflowStatusId = workflowStatus.Id,
                InsertedBy = userId.ToString(),
                TenantId = tenantId,
                UserId = user.Id,
            };

            var newChild = childRepo.Insert(child);           

            // Create learner record
            learnerRepo.Insert(new Learner
            {
                Id = Guid.NewGuid(),
                ClassroomGroupId = classgroupId,
                UserId = child.UserId,
                StartedAttendance = DateTime.Now,
            });

            var tokenWrapper = new ChildTokenWrapperModel
            {
                AddedByUserId = addedByUser.Id.ToString(),
                ClassroomGroupId = classgroupId,
                Token = await tokenManager.GenerateTokenAsync(child.User),
                ChildId = newChild.Id,
                ChildUserId = newChild.UserId.ToString()
            };

            var baseUrl = optionAccessor.Value.Login;
            var registrationUrl = $"{baseUrl}child-registration-landing?token={TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper))}";
            var registrationDetails = new InitialChildRegistrationModel
            {
                AddedByUserId = addedByUser.Id,
                ClassroomGroupId = classgroupId,
                ChildId = newChild.Id,
                ChildUserId = child.UserId.Value,
                CaregiverRegistrationUrl = shortUrlManager.GetUrlToken(
                    registrationUrl,
                    child.User,
                    "ChildRegistration"),
            };

            return registrationDetails;
        }

        /// <summary>
        /// This is the endpoint used to complete registration as a caregiver
        /// </summary>s
        /// <returns></returns>
        [TokenAccess(typeof(ChildOpenAccessValidator))]
        public async Task<bool> OpenAccessAddChild(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            [Service] IDocumentManagementService documentManagementService,
            [Service] ApplicationUserManager userManager,
            string token,
            AddChildCaregiverTokenModel caregiver,
            AddChildSiteAddressTokenModel siteAddress,
            AddChildTokenModel child,
            AddChildRegistrationTokenModel registration,
            AddChildUserConsentTokenModel consent,
            [Service] INotificationService notificationService)
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
            var childRepo = repoFactory.CreateRepository<Child>(scope, tokenModel.AddedByUserId);
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(scope, tokenModel.AddedByUserId);
            var pointsRepo = repoFactory.CreateRepository<PointsUserSummary>(scope, tokenModel.AddedByUserId);
            var pointsLibraryRepo = repoFactory.CreateRepository<PointsLibrary>(scope, tokenModel.AddedByUserId);

            try
            {
                // Fetch the child
                var childEntity = childRepo.GetById(tokenModel.ChildId);

                //// Update
                childEntity.Allergies = child.Allergies;
                childEntity.Disabilities = child.Disabilities;
                childEntity.LanguageId = child.LanguageId;
                childEntity.OtherHealthConditions = child.OtherHealthConditions;
                childEntity.WorkflowStatusId = child.WorkflowStatusId;

                childEntity.Caregiver = new Caregiver
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
                    SiteAddress = new SiteAddress
                    {
                        AddressLine1 = siteAddress.AddressLine1,
                        AddressLine2 = siteAddress.AddressLine2,
                        AddressLine3 = siteAddress.AddressLine3,
                        Name = siteAddress.Name,
                        PostalCode = siteAddress.PostalCode,
                        ProvinceId = siteAddress.ProvinceId,
                        Ward = siteAddress.Ward
                    }
                };

                childRepo.Update(childEntity);


                appUser.GenderId = child.GenderId;
                appUser.DateOfBirth = child.DateOfBirth;
                appUser.IsSouthAfricanCitizen = child.IsSouthAfricanCitizen;
                appUser.RaceId = child.RaceId;
                appUser.VerifiedByHomeAffairs = child.VerifiedByHomeAffairs;
                await userManager.UpdateAsync(appUser);

                if (registration != null)
                {
                    documentManagementService.AddUserDocument(registration.UserId, registration.FileType, registration.File, registration.FileName, tokenModel.AddedByUserId);
                }

                if (consent != null)
                {
                    AddConsent(scope, consent, tokenModel);
                }

                // TODO - Points needs to be updated after GG changes
                //// Add points for registering a child - Could also fetch by the inserting user
                //var practitioner = practitionerRepo.GetAll().Where(x => childEntity.Hierarchy.StartsWith(x.Hierarchy)).FirstOrDefault();
                //if (practitioner != null)
                //{
                //    AddRegistrationPoints(pointsRepo, pointsLibraryRepo, practitioner.UserId.ToString(), practitioner.IsPrincipalOrAdmin());
                //    await notificationService.ExpireNotificationsTypesForUser(practitioner.UserId.ToString(), TemplateTypeConstants.ChildRegistrationIncomplete, null, child.UserId.ToString());
                //}

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
            }

            return true;
        }

        #region Child registration points

        private void AddRegistrationPoints(
            IGenericRepository<PointsUserSummary, Guid> pointsUserSummaryRepo,
            IGenericRepository<PointsLibrary, Guid> pointsLibraryRepo,
            string userId, bool isPrincipalOrAdmin = false)
        {
            var currentDate = DateTime.Now;

            var activity = pointsLibraryRepo.GetAll()
                .Where(x => x.Activity == Constants.PointsEngineSettings.child_data_collection
                    && x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac1)
                .Single();

            var pointsScoredThisYear = pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Year == currentDate.Year && x.PointsLibraryId == activity.Id).ToList();

            // Get new totals, sum of current month or year, plus one more score
            var monthsRecord = pointsScoredThisYear.Where(x => x.Month == currentDate.Month).FirstOrDefault();
            var monthTotal = activity.Points;
            var timesScored = 1;

            if (monthsRecord != null)
            {
                timesScored += monthsRecord.TimesScored;
                monthTotal += monthsRecord.PointsTotal;
            }

            int ytdTotal = pointsScoredThisYear.Select(x => x.PointsTotal).Sum() + activity.Points;

            if (isPrincipalOrAdmin)
            {
                if (activity.MaxPointsPrincipalMonthly != 0 && monthTotal > activity.MaxPointsPrincipalMonthly)
                {
                    monthTotal = activity.MaxPointsNonPrincipalMonthly;
                }
                if (activity.MaxPointsPrincipalYearly != 0 && ytdTotal > activity.MaxPointsPrincipalYearly)
                {
                    ytdTotal = activity.MaxPointsPrincipalYearly;
                }
            }
            else
            {
                if (activity.MaxPointsIndividualMonthly != 0 && monthTotal > activity.MaxPointsIndividualMonthly)
                {
                    monthTotal = activity.MaxPointsNonPrincipalMonthly;
                }
                if (activity.MaxPointsNonPrincipalYearly != 0 && ytdTotal > activity.MaxPointsNonPrincipalYearly)
                {
                    ytdTotal = activity.MaxPointsNonPrincipalYearly;
                }
            }

            if (monthTotal > 0 && ytdTotal > 0)
            {
                var record = pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Month == currentDate.Month && x.Year == currentDate.Year && x.PointsLibraryId == activity.Id).FirstOrDefault();
                if (record == null)
                {
                    pointsUserSummaryRepo.Insert(
                        new PointsUserSummary
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = userId,
                            Month = currentDate.Month,
                            Year = currentDate.Year,
                            UserId = Guid.Parse(userId),
                            PointsLibraryId = activity.Id,
                            PointsTotal = monthTotal,
                            PointsYTD = ytdTotal,
                            TimesScored = timesScored,
                        }
                    );
                }
                else
                {
                    record.PointsTotal = monthTotal;
                    record.PointsYTD = ytdTotal;
                    record.UpdatedDate = DateTime.Now;
                    record.UpdatedBy = userId;
                    record.TimesScored = timesScored;

                    pointsUserSummaryRepo.Update(record);
                }
            }
        }

        #endregion

        public void CalculateChildrenRegistrationRemoval([Service] IPointsEngineService pointsEngineService, Guid userId)
        {
            pointsEngineService.CalculateChildRemovedFromPreschool(userId);
        }

        private bool AddConsent(AuthenticationDbContext context, AddChildUserConsentTokenModel consent, ChildTokenWrapperModel tokenModel)
        {
            if (consent.ChildPhotoConsentAccepted == true)
            {
                UserConsent consentPhoto = new UserConsent()
                {
                    Id = Guid.NewGuid(),
                    ConsentId = 175,
                    ConsentType = "PhotoPermissions",
                    UserId = new Guid(consent.UserId),
                    CreatedUserId = Guid.Parse(tokenModel.AddedByUserId),
                    TenantId = _tenantId,
                    IsActive = true,
                    InsertedDate = DateTime.Now
                };
                context.UserConsents.Add(consentPhoto);
                context.SaveChanges();
            }            
            if (consent.PersonalInformationAgreementAccepted == true)
            {
                UserConsent personalAgreement = new UserConsent()
                {
                    Id = Guid.NewGuid(),
                    ConsentId = 171,
                    ConsentType = "PersonalInformationAgreement",
                    UserId = new Guid(consent.UserId),
                    CreatedUserId = Guid.Parse(tokenModel.AddedByUserId),
                    TenantId = _tenantId,
                    IsActive = true,
                    InsertedDate = DateTime.Now
                };
                context.UserConsents.Add(personalAgreement);
                context.SaveChanges();
            }
            return true;
        }

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Create)]
        public async Task<InitialChildRegistrationModel> RefreshCaregiverChildToken(
            [Service] ITokenManager<ApplicationUser, OpenAccessTokenManager> tokenManager,
            [Service] ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContext,
            [Service] ShortUrlManager shortUrlManager,
            [Service] ISystemSetting<SecurityNotificationOptions> optionAccessor,
            Guid childId,
            Guid classgroupId)
        {
            if (childId == Guid.Empty)
            {
                throw new QueryException($"{nameof(childId)} cannot be empty");
            }

            var childRepo = repoFactory.CreateRepository<Child>(userContext: httpContext.HttpContext.GetUser().Id);
            var child = childRepo.GetById(childId);

            if (classgroupId == Guid.Empty)
            {
                var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: httpContext.HttpContext.GetUser().Id);
                var learner = learnerRepo.GetAll().Where(x => x.UserId == child.UserId)?.FirstOrDefault();
                classgroupId = learner.ClassroomGroupId;
            }

            if (child == null)
            {
                throw new QueryException($"Child not found");
            }

            var appUser = await userManager.FindByIdAsync(child.UserId.ToString());

            if (appUser == null)
            {
                throw new QueryException($"Child user not found");
            }

            await tokenManager.RetractTokensAsync(appUser);

            var tokenWrapper = new ChildTokenWrapperModel
            {
                AddedByUserId = httpContext.HttpContext.GetUser().Id.ToString(),
                ClassroomGroupId = classgroupId,
                Token = await tokenManager.GenerateTokenAsync(appUser),
                ChildId = child.Id,
                ChildUserId = appUser.Id.ToString()
            };

            var baseUrl = optionAccessor.Value.Login;
            var registrationUrl = $"{baseUrl}child-registration-landing?token={TokenHelper.EncodeToken(JsonConvert.SerializeObject(tokenWrapper))}";
            var registrationDetails = new InitialChildRegistrationModel
            {
                AddedByUserId = Guid.Parse(child.InsertedBy),
                ClassroomGroupId = classgroupId,
                ChildId = child.Id,
                ChildUserId = child.UserId.Value,
                CaregiverRegistrationUrl = shortUrlManager.GetUrlToken(
                    registrationUrl,
                    child.User,
                    "ChildRegistration"),
            };

            return registrationDetails;
        }        
    }
}
