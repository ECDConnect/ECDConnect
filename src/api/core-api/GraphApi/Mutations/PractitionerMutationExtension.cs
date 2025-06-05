using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
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

                    if (input.CoachHierarchy != null)
                    {
                        practitioner.CoachHierarchy = input.CoachHierarchy;
                        practitioner.CoachLinkDate = DateTime.Now.Date;
                    }
                    practitioner.IsActive = input.IsActive;
                    if (input.AttendanceRegisterLink != null) practitioner.AttendanceRegisterLink = input.AttendanceRegisterLink;
                    if (input.IsPrincipal != null) practitioner.IsPrincipal = input.IsPrincipal;
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
                    if (practitioner.IsPrincipalOrAdmin())
                    {
                        // update coach hierarchy for all practitioners linked to principal
                        var linkedPractitioners = dbRepo.GetAll().Where(x => x.IsActive == true && x.IsRegistered == true && x.PrincipalHierarchy == practitioner.UserId).ToList();
                        if (linkedPractitioners.Any() && practitioner.CoachHierarchy != null)
                        {
                            foreach (var item in linkedPractitioners)
                            {
                                item.CoachHierarchy = practitioner.CoachHierarchy;
                                item.CoachLinkDate = DateTime.Now.Date;
                                dbRepo.Update(item);
                            }
                        }
                    }

                    Practitioner updateResult = dbRepo.Update(practitioner);

                    return updateResult;
                }
                return practitioner;
            }
        }

        public bool UpdatePractitionerShareInfo([Service] IHttpContextAccessor contextAccessor, [Service] INotificationService notificationService,
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
                    //deactivate notifications
                    //notificationService.ExpireNotificationsTypesForUser(practitionerId, TemplateTypeConstants.PrincipalFAAChanged, null, null, Guid.Parse(practitionerId));

                    return true;
                }
            }

            return bReturn;
        }

        public bool UpdatePractitionerRegistered(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationTasksService notificationTasksService,
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
                    if (practitioner.CoachHierarchy.HasValue && practitioner.IsRegistered == true)
                    {
                        notificationTasksService.RemoveCoachNotification(practitioner.CoachHierarchy.Value);
                    }
                    return true;
                }
            }

            return status;
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
    [Service] ApplicationUserManager userManager,
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
         [Service] ApplicationUserManager userManager,
         [Service] ShortUrlManager shortUrlManager,
         string userId)
        {
            var inviteCount = shortUrlManager.GetMessageCountForUser(Guid.Parse(userId), TemplateTypeConstants.Invitation);

            // TODO: Do we need this arbitrary check?
            if (inviteCount < 6)
            {
                // TODO: Make service for invitations
                SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
                return await invite.SendInviteToApplication(invitationManager, notificationManager, userManager, userId);
            }

            return false;
        }


        public async Task<bool> RemovePractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IReassignmentService reassignmentService,
            [Service] PersonnelService personnelService,
            ApplicationUserManager userManager,
            string practitionerUserId, 
            string reasonForPractitionerLeavingId, 
            string reasonDetails, 
            string newPrincipalId, 
            List<ClassroomGroupReassignments> classroomGroupReassignments)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerUserId);

            if (!string.IsNullOrEmpty(newPrincipalId))
            {
                personnelService.SwitchPrincipal(practitionerUserId, newPrincipalId);
            }

            //Reassign all the classes for the practitioner as indicated            
            foreach (var reassignment in classroomGroupReassignments)
            {
                if (reassignment.ClassroomGroupId != null || reassignment.PractitionerId != null)
                {
                    reassignmentService.AddReassignmentForPractitioner(practitioner.UserId.ToString(), reassignment.PractitionerId, "Practitioner removed by coach", DateTime.Now, uId.ToString(), reassignment.ClassroomGroupId, true);
                }               
            }
           
            return await personnelService.DeActivatePractitionerAsync(practitionerUserId, "Practitioner removed by coach", reasonForPractitionerLeavingId, reasonDetails);
        }

        public async Task<bool> DeActivatePractitioner([Service] PersonnelService personnelService,
            string userId, string leavingComment, string reasonForPractitionerLeavingId, string reasonDetails)
        {
            return await personnelService.DeActivatePractitionerAsync(userId, leavingComment, reasonForPractitionerLeavingId, reasonDetails);
        }
        public bool RemoveFromProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IAbsenteeService absenteeService,
            [Service] INotificationService notificationService,
            ApplicationUserManager userManager,
            string practitionerUserId, 
            string classroomId, 
            string reasonForPractitionerLeavingProgrammeId, 
            string reasonDetails, 
            DateTime dateOfRemoval, 
            List<ClassroomGroupReassignments> classroomGroupReassignments)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            // Save the removal history
            var history = new PractitionerRemovalHistory
            {
                UserId = Guid.Parse(practitionerUserId),
                ClassroomId = Guid.Parse(classroomId),
                RemovedByUserId = uId,
                ReasonForPractitionerLeavingProgrammeId = Guid.Parse(reasonForPractitionerLeavingProgrammeId),
                ReasonDetails = reasonDetails,
                DateOfRemoval = dateOfRemoval,
            };

            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var removalHistory = removalRepo.Insert(history);

            //Reassign all the classes for the practitioner as indicated
            foreach (var reassignment in classroomGroupReassignments)
            {
                if (reassignment.ClassroomGroupId == null || reassignment.PractitionerId == null)
                {
                    return false;
                }
                absenteeService.AddAbsenteeForPractitioner(practitionerUserId, reassignment.PractitionerId, "Practitioner removed from programme", dateOfRemoval, uId.ToString(), reassignment.ClassroomGroupId, null, false, null, null, null, removalHistory.Id);
            }
            var userToSend = userManager.FindByIdAsync(practitionerUserId).Result;
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var classRoom = classroomRepo.GetById(Guid.Parse(classroomId));
            if (classRoom != null)
            {
                var principalUser = userManager.FindByIdAsync(classRoom.UserId.ToString()).Result;
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ProgrammeName",
                    ReplacementValue = classRoom.Name
                });

                replacements.Add(new TagsReplacements()
                {
                    FindValue = "PrincipalName",
                    ReplacementValue = principalUser.FirstName + " " + principalUser.Surname
                });

                //principaluser to send
                if (principalUser != null && userToSend != null)
                {
                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerRemovedFromProgramme, DateTime.Now.Date, principalUser, "", MessageStatusConstants.Red, new List<TagsReplacements>() { new TagsReplacements() { FindValue = "PractitionerName", ReplacementValue = userToSend.FirstName } }, DateTime.Now.AddDays(7), false, true, null,
                        relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(practitionerUserId), "ApplicationUser") });
                }
                notificationService.SendNotificationAsync(null, TemplateTypeConstants.RemovedFromProgramme, dateOfRemoval.Date, userToSend, "", MessageStatusConstants.Red, replacements, dateOfRemoval.AddDays(7), false,true,null,
                    relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(practitionerUserId), "ApplicationUser") });
            }



            return true;
        }
        public bool UpdateRemovalFromProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IAbsenteeService absenteeService,
            string removalId, string reasonForPractitionerLeavingProgrammeId, string reasonDetails, DateTime dateOfRemoval, List<ClassroomGroupReassignments> classroomGroupReassignments)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var removal = removalRepo.GetById(Guid.Parse(removalId));

            removal.ReasonForPractitionerLeavingProgrammeId = Guid.Parse(reasonForPractitionerLeavingProgrammeId);
            removal.ReasonDetails = reasonDetails;
            removal.DateOfRemoval = dateOfRemoval;

            removalRepo.Update(removal);

            var absenteeRepo = repoFactory.CreateGenericRepository<Absentees>(userContext: uId);
            //Create an absentee entry for each reassigned class, so they can be reassigned later
            foreach (var reassignment in classroomGroupReassignments)
            {
                if (reassignment.ClassroomGroupId == null || reassignment.PractitionerId == null)
                {
                    return false;
                }

                if(reassignment.Id == null)
                {
                    absenteeService.AddAbsenteeForPractitioner(removal.UserId.ToString(), reassignment.PractitionerId, "Practitioner removed from programme", dateOfRemoval, uId.ToString(), reassignment.ClassroomGroupId, null, false,null,null,null, removal.Id);
                }
                else
                {
                    var absentee = absenteeRepo.GetById(Guid.Parse(reassignment.Id));
                    absentee.AbsentDate = dateOfRemoval;
                    absentee.ReassignedClass = reassignment.ClassroomGroupId;
                    absentee.ReassignedToPractitioner = reassignment.PractitionerId;
                    absenteeRepo.Update(absentee);
                }
            }

            return true;
        }

        public bool CancelRemovalFromProgramme(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string removalId)
        {
            var removalGuid = Guid.Parse(removalId);
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var removal = removalRepo.GetById(removalGuid);

            removal.IsActive = false;

            removalRepo.Update(removal);

            var absenteeRepo = repoFactory.CreateGenericRepository<Absentees>(userContext: uId);
            var absentees = absenteeRepo.GetAll().Where(x => x.PractitionerRemovalHistoryId == removalGuid).ToList();
            {
                foreach (var absentee in absentees)
                {
                    absentee.IsActive = false;
                    absenteeRepo.Update(absentee);
                }
            }

            return true;
        }

        public bool UpdatePractitionerBusinessWalkthrough([Service] PersonnelService personnelService, string userId)
        {
            return personnelService.UpdatePractitionerBusinessWalkthrough(userId);
        }

        public bool UpdatePractitionerProgressWalkthrough([Service] PersonnelService personnelService, string userId)
        {
            personnelService.UpdatePractitioneProgressWalkthrough(userId);
            return true;
        }

        public Practitioner UpdatePractitionerCommunityTabStatus(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid practitionerUserId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitioner = practitionerRepo.GetByUserId(practitionerUserId);
            if (practitioner != null)
            {
                practitioner.ClickedCommunityTab = true;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.UpdatedBy = uId.ToString();
                return practitionerRepo.Update(practitioner);
            }
            return null;
        }

    }
}
