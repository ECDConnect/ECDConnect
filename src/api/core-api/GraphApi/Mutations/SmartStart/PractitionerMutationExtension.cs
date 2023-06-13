using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PractitionerMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Practitioner UpdatePractitioner([Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory,
          Guid? id,
          Practitioner input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);

            if (id == null) id = input.Id;

            Practitioner practitioner = dbRepo.GetById((Guid)id);
            {
                if (practitioner != null)
                {

                    if (input.CoachHierarchy != null) practitioner.CoachHierarchy = input.CoachHierarchy;
                    practitioner.IsActive = input.IsActive;
                    if (input.AttendanceRegisterLink != null) practitioner.AttendanceRegisterLink = input.AttendanceRegisterLink;
                    if (input.MaxChildren != null) practitioner.MaxChildren = input.MaxChildren;
                    if (input.IsPrincipal != null) practitioner.IsPrincipal = input.IsPrincipal;
                    if (input.IsFundaAppAdmin != null) practitioner.IsFundaAppAdmin = input.IsFundaAppAdmin;
                    if (input.PrincipalHierarchy != null) practitioner.PrincipalHierarchy = input.PrincipalHierarchy;                    
                    if (input.SigningSignature != null) practitioner.SigningSignature = input.SigningSignature;
                    if (input.StartDate != null) practitioner.StartDate = input.StartDate;

                    if (input.SiteAddress != null && input.SiteAddressId.HasValue)
                    {
                        var addressRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
                        SiteAddress address = addressRepo.GetById(input.SiteAddressId.Value);
                        if (input.SiteAddress.Ward != null)
                            address.Ward = input.SiteAddress.Ward;
                        if (input.SiteAddress.AddressLine1 != null)
                            address.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input.SiteAddress.AddressLine2 != null)
                            address.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input.SiteAddress.AddressLine3 != null)
                            address.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input.SiteAddress.PostalCode != null)
                            address.PostalCode = input.SiteAddress.PostalCode;
                        if (input.SiteAddress.ProvinceId != null)
                            address.ProvinceId = input.SiteAddress.ProvinceId;
                        addressRepo.Update(address);
                    }
                    if (input.SiteAddress != null && input.SiteAddressId == null)
                    {
                        //create siteaddress
                        var addressRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
                        SiteAddress address = new SiteAddress();
                        if (input.SiteAddress.Ward != null)
                            address.Ward = input.SiteAddress.Ward;
                        if (input.SiteAddress.AddressLine1 != null)
                            address.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input.SiteAddress.AddressLine2 != null)
                            address.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input.SiteAddress.AddressLine3 != null)
                            address.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input.SiteAddress.PostalCode != null)
                            address.PostalCode = input.SiteAddress.PostalCode;
                        if (input.SiteAddress.ProvinceId != null)
                            address.ProvinceId = input.SiteAddress.ProvinceId;
                        var updateAddressResult = addressRepo.Insert(address);
                        if (updateAddressResult != null)
                            practitioner.SiteAddressId = updateAddressResult.Id;
                    }

                    if (input.IsTrainee != null)
                    {
                        practitioner.IsTrainee = input.IsTrainee;
                        if ((bool)input.IsTrainee)
                        {
                            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: uId);
                            var trainee = traineeRepo.GetByUserId(input.UserId);
                            if (trainee == null)
                            {
                                //create Trainee record
                                traineeRepo.Insert(new Trainee() { UserId = input.UserId, IsActive = true, Id = input.Id });
                            }
                        }
                    }

                    Practitioner updateResult = dbRepo.Update(practitioner);
                    return updateResult;
                }
                return practitioner;
            }
        }

        public bool UpdatePractitionerShareInfo([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            bool bReturn = false;

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.ShareInfo = true;
                    practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return bReturn;
        }

        public bool UpdatePractitionerRegistered([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId, bool status = false)

        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.IsRegistered = status;
                    practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return status;
        }

        public bool UpdatePractitionerIsFundaAppAdmin([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            bool bReturn = false;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.IsFundaAppAdmin = true;
                    practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return bReturn;
        }

        public decimal UpdatePractitionerProgress([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId, decimal progress)

        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.Progress = progress;
                    practitionerRepo.Update(practitioner);
                    return practitioner.Progress;
                }
            }

            return 0;
        }


        public string UpdatePractitionerUsePhotoInReport([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId, string usePhotoInReport)

        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.UsePhotoInReport = usePhotoInReport;
                    practitionerRepo.Update(practitioner);
                    return practitioner.UsePhotoInReport;
                }
            }

            return null;
        }

        public bool UpdatePractitionerEmergencyContact([Service] IHttpContextAccessor contextAccessor,
    IGenericRepositoryFactory repoFactory,
    [Service] UserManager<ApplicationUser> userManager,
    string userId, string firstname, string surname, string contactno)

        {
            var user = userManager.FindByIdAsync(userId).Result;
            user.EmergencyContactFirstName = firstname;
            user.EmergencyContactSurname = surname;
            user.EmergencyContactPhoneNumber = contactno;

            var userUpdateResult = userManager.UpdateAsync(user).Result;
            return userUpdateResult.Succeeded;
        }

        public async Task<bool> SendPractitionerInviteToApplication(
         [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
         [Service] InvitationNotificationManager notificationManager,
         [Service] UserManager<ApplicationUser> userManager,
         [Service] ShortUrlManager shortUrlManager,
         string userId)
        {
            var messageType = "invitation";
            var inviteCount = shortUrlManager.GetMessageCountForUser(userId, messageType);

            if (inviteCount < 6)
            {
                SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
                return await invite.SendInviteToApplication(invitationManager, notificationManager, userManager, userId);
            }

            return false;
        }


        public bool DeActivatePractitioner([Service] PersonnelService personnelService, string userId, string leavingComment)
        {
            return personnelService.DeActivatePractitioner(userId, leavingComment);
        }

        public bool DelicensePractitioner([Service] UserLicenseManager userLicenseManager, LicenseModel input)
        {
            return userLicenseManager.DelicenseUser(input);
        }

    }
}
