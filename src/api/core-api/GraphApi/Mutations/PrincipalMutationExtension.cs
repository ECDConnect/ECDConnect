using EcdLink.Api.CoreApi.GraphApi.Queries;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PrincipalMutationExtension
    {
        public Practitioner AddPractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
                                                        [Service] ApplicationUserManager userManager,
                                                        [Service] PersonnelService personnelManager,
                                                        IGenericRepositoryFactory repoFactory,
                                                        [Service] INotificationService notificationService,
                                                        [Service] IPointsEngineService pointsService,
                                                        AuthenticationDbContext dbContext,
                                                        string firstName,
                                                        string lastName,
                                                        string idNumber,
                                                        string userId,
                                                        Guid? programmeTypeId,
                                                        string? preschoolCode = "")
        {
            //ensure only principals or FAAs can be assigned to be a parent of another practitioner, so they cannot be joined to themselves or unrelated users
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitionerUser = new PractitionerQueryExtension().GetPractitionerByIdNumberInternal(contextAccessor, dbContext, repoFactory, idNumber);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var principalUser = practitionerRepo.GetByUserId(userId);
 
            if (principalUser != null && (principalUser.IsPrincipal == true)) //make sure the principal user exists and is a principal
            {
                if (practitionerUser != null)
                {
                    Practitioner practitioner = practitionerRepo.GetByUserId(practitionerUser.Id);
                    if (practitioner != null && principalUser.UserId != practitioner.UserId)
                    {
                        practitioner.DateLinked = DateTime.Now;
                        practitioner.PrincipalHierarchy = principalUser.UserId;
                        practitioner.IsPrincipal = false;
                        practitionerRepo.Update(practitioner);

                        // add points for adding practitioner to programme
                        pointsService.CalculateAddNewPractitionerToPreschool(principalUser.UserId.Value);

                        //link the practitioners classroom groups to the correct classroom
                        Classroom principalClassRoom = classroomRepo.GetAll().Where(x => x.UserId == principalUser.UserId).OrderBy(x => x.Id).FirstOrDefault();
                        List<ClassroomGroup> classroomGroups = classroomGroupRepo.GetAll().Where(x => x.IsActive && (x.UserId.HasValue && x.UserId == practitioner.UserId))
                                                                                   .OrderBy(x => x.Id)
                                                                                   .ToList();
                        if (classroomGroups != null && classroomGroups.Count > 0)
                        {
                            var classroomIds = new List<Guid>();
                            Classroom classroom = null;

                            foreach (var group in classroomGroups)
                            {
                                if (principalClassRoom != null && principalClassRoom.Id != group.ClassroomId)
                                {
                                    classroom = classroomRepo.GetById(group.ClassroomId);
                                    group.ClassroomId = principalClassRoom.Id;
                                    if (programmeTypeId != null)
                                    {
                                        group.ProgrammeTypeId = programmeTypeId;
                                    }
                                    classroomGroupRepo.Update(group);
                                    if (classroom != null)
                                    {
                                        classroomIds.Add(classroom.Id);
                                    }
                                }
                            }
                            if (classroomIds != null && classroomIds.Count() > 0 && practitioner.Progress >= 2)
                            {
                                personnelManager.RemovePractitionerClassrooms(classroomIds);
                            }
                        }
                        //update users nicknames
                        var user = userManager.FindByIdAsync(practitioner.UserId.ToString()).Result;
                        user.NickFirstName = firstName;
                        user.NickSurname = lastName;
                        user.NickFullName = firstName + " " + lastName;

                        userManager.UpdateAsync(user);

                        string programmeName = principalClassRoom != null ? principalClassRoom.Name : "Programme";
                        var replacements = new List<TagsReplacements>
                        {
                            new TagsReplacements()
                            {
                                FindValue = "ProgrammeName",
                                ReplacementValue = programmeName
                            },
                            new TagsReplacements()
                            {
                                FindValue = "ApplicationName",
                                ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                            },
                            new TagsReplacements()
                            {
                                FindValue = "PrincipalName",
                                ReplacementValue = principalUser.User.FirstName
                            }
                        };
                        // send message of invitation only if principal is adding the practitioner to the programme
                        // not sending message when the practitioner has joined the preschool on their own
                        if (uId != practitionerUser.Id)
                        {
                            if (practitioner.Progress >= 0 && practitioner.Progress < 2)
                            {
                                notificationService.SendNotificationAsync(null, TemplateTypeConstants.ProgrammeInvitation, DateTime.Now.Date, user, "", MessageStatusConstants.Amber, replacements);
                            } else
                            {
                                if (practitioner.Progress > 2)
                                {
                                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.MultipleProgrammeInvitation, DateTime.Now.Date, user, "", MessageStatusConstants.Amber, replacements);
                                }
                            }

                        } else
                        {
                            // send message to principal if preschool code is available
                            if (preschoolCode != "")
                            {
                                replacements = new List<TagsReplacements>
                                {
                                    new TagsReplacements()
                                    {
                                        FindValue = "PractitionerFirstName",
                                        ReplacementValue = practitioner.User.FirstName
                                    },
                                    new TagsReplacements()
                                    {
                                        FindValue = "PreschoolName",
                                        ReplacementValue = programmeName
                                    }
                                };

                                notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerJoinedWithPreschoolCode, DateTime.Now.Date, principalUser.User, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
                            }
                        }
                        return practitioner;
                    }
                    else return null; 
                }
                else return null;
            }
            return null;
        }

        private static string replaceIfNotNullOrWhiteSpace(string original, string @new)
        {
            return string.IsNullOrWhiteSpace(@new) ? original : @new;
        }

        public ApplicationUser UpdatePractitionerContactInfo([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] ApplicationUserManager userManager,
            [Service] IHttpContextAccessor httpContextAccessor,
            string practitionerId, string firstName, string lastName, string phoneNumber, string email)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();

            var user = userManager.FindByIdAsync(practitionerId).Result;
            var currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;

            if (user is null || currentUserId is null)
                throw new QueryException("User not found.");

            if (phoneNumber != user.PhoneNumber && !string.IsNullOrWhiteSpace(phoneNumber))
            {
                user.PhoneNumber = UserHelper.NormalizePhoneNumber(replaceIfNotNullOrWhiteSpace(user.PhoneNumber, phoneNumber));
                user.PendingPhoneNumber = null;
            }

            if (user.Email != email && !string.IsNullOrWhiteSpace(email) && user.Id == currentUserId)
            {
                user.Email = email;
                user.EmailConfirmed = false;
            }

            if (user.NickFirstName != firstName && !string.IsNullOrWhiteSpace(firstName))
            {
                user.NickFirstName = firstName;
            }

            if (user.NickSurname != lastName && !string.IsNullOrWhiteSpace(lastName))
            {
                user.NickSurname = lastName;
            }

            user.NickFullName = user.NickFirstName + " " + user.NickSurname;
            user.UpdatedDate = DateTime.UtcNow;

            userManager.UpdateAsync(user);

            return user;
        }

        public Practitioner DeletePractitionerFromPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            string userId, string principalId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == Guid.Parse(userId)).Where(y => y.PrincipalHierarchy.HasValue && y.PrincipalHierarchy.Value == Guid.Parse(principalId)).OrderBy(x => x.Id).FirstOrDefault();
            {
                practitioner.PrincipalHierarchy = null;
                practitioner.ShareInfo = false;
                practitionerRepo.Update(practitioner);
            }
            //principaluser to send
            var userToSend = userManager.FindByIdAsync(principalId).Result;
            if (userToSend != null && practitioner != null && practitioner.User != null)
            {
                notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerRemovedFromProgramme, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, new List<TagsReplacements>() { new TagsReplacements() { FindValue = "PractitionerName", ReplacementValue = practitioner.User.FirstName } }, DateTime.Now.AddDays(7), false, true, null,
                    relatedEntities: new List<RelatedEntity> { new RelatedEntity(practitioner.UserId.Value, "ApplicationUser") });
            }

            return practitioner;
        }

        public Practitioner RemapPrincipalToPrincipal([Service] IHttpContextAccessor contextAccessor,
     IGenericRepositoryFactory repoFactory,
     string oldPrincipalId, string newPrincipalId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner oldPrincipal = practitionerRepo.GetByUserId(oldPrincipalId);
            Practitioner newPrincipal = practitionerRepo.GetByUserId(newPrincipalId);

            //reassign all practitioners to the new principal
            if (oldPrincipal != null && newPrincipal != null)
            {
                List<Practitioner> allPrincipalPractitioners = practitionerRepo.GetAll().Where(x => x.PrincipalHierarchy == oldPrincipal.UserId).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = newPrincipal.UserId;
                        practi.CoachHierarchy = newPrincipal.CoachHierarchy;
                        practi.ShareInfo = true;
                        practi.CoachLinkDate = DateTime.Now.Date;
                        practitionerRepo.Update(practi);
                    }
                }
            }
            return newPrincipal;
        }

        public bool SwitchPrincipal([Service] PersonnelService personnelManager,
            [Service] ApplicationUserManager userManager,
            string oldPrincipalUserId,
            string newPrincipalUserId)
        {
            var result = personnelManager.SwitchPrincipal(oldPrincipalUserId, newPrincipalUserId);
            return result != null;
        }

        public Principal PromotePractitionerToPrincipal([Service] PersonnelService personnelManager,
             string userId, bool sendComm = false)
        {
            Practitioner practitionerToPromote = personnelManager.PromotePractitionerToPrincipal(userId, sendComm);
            return personnelManager.MapPractitionerToPrincipal(practitionerToPromote);
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] PersonnelService personnelManager,
             string userId)
        {
            Practitioner practitionerToDemote = personnelManager.DemotePractitionerAsPrincipal(userId);
            return practitionerToDemote;
        }

        public PrincipalInvitationStatus UpdatePrincipalInvitation([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] ISystemSetting<InvitationCutoffDelayOptions> invitationDelay,
            [Service] IReassignmentService reassignmentService,
            [Service] INotificationService notificationService,
            [Service] PersonnelService personnelManager,
            [Service] IClassroomService classroomService,
            [Service] ApplicationUserManager userManager,
            string practitionerId, 
            string principalId, 
            bool accepted)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner principal = practitionerRepo.GetByUserId(principalId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            PrincipalInvitationStatus status = new PrincipalInvitationStatus();

            //reassign all practitioners to the new principal
            if (principal == null || practitioner == null)
            {
                throw new ArgumentException("Principal or practitioner not found");
            }
            
            status.LinkedDate = practitioner.DateLinked;
            if (accepted == false)
            {
                //reset the classroomgroups away from this practitioner and back to teh principal
                //if (principal.UserId != null && practitioner.UserId != null)
                {
                    //Reassign all classes and programmes back to principal
                    reassignmentService.AddReassignmentForPractitioner(practitioner.UserId.ToString(), principal.UserId.ToString(), "Removing link between Principal and Practitioner", DateTime.Now, uId.ToString(), null, true);
                }

                status.AcceptedDate = null;
                int hrsToReassign = int.Parse(invitationDelay.Value.InvitationCutoffDelay);
                bool sendRejectedNotification = true;
                //if the function is run twice and the leaving date is already set, remove immediately, this is the principal confirming removal of this practitioner link
                if (practitioner.DateToBeRemoved != null || practitioner.IsRegistered == null)
                {
                    practitioner.DateToBeRemoved = DateTime.Now;
                    practitioner.DateAccepted = null;
                    practitioner.DateLinked = null;
                    practitioner.IsLeaving = true;
                    //update and clear the principals details
                    practitioner.PrincipalHierarchy = null;
                    practitioner.ShareInfo = false;

                    status.LeavingDate = DateTime.Now;
                    status.Leaving = true;

                    notificationService.ExpireNotificationsTypesForUser(principal.UserId.ToString(), TemplateTypeConstants.RejectedInvitation, practitioner.User.FirstName + " " + practitioner.User.Surname);

                    //if the practitioner is not registered and the principal rescinds the invite
                    if (practitioner.IsRegistered == null && principal.UserId.Equals(uId))
                    {
                        sendRejectedNotification = false;
                    }   
                }
                else
                {
                    //reset the classroomgroups away from this practitioner and back to the principal
                    //if (principal.UserId != null && practitioner.UserId != null)
                    {
                        //Reassign all classes and programmes back to principal
                        reassignmentService.AddReassignmentForPractitioner(practitioner.UserId.ToString(), principal.UserId.ToString(), "Removing link between Principal and Practitioner", DateTime.Now, uId.ToString(), null, true);
                    }

                    practitioner.DateToBeRemoved = DateTime.Now.AddHours(hrsToReassign);
                    practitioner.DateAccepted = null;
                    practitioner.IsLeaving = true;
                    practitioner.PrincipalHierarchy = null;
                    practitioner.ShareInfo = false;

                    status.LeavingDate = DateTime.Now.AddHours(hrsToReassign);
                    status.Leaving = true;
                }
                if (sendRejectedNotification)
                {
                    //send message of rejection
                    string programmeName = personnelManager.GetSiteNameForPractitioner(principal.UserId.ToString());
                    List<TagsReplacements> replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements() { FindValue = "PractitionerName", ReplacementValue = practitioner.User.FullName },
                        new TagsReplacements() { FindValue = "ProgrammeName", ReplacementValue = programmeName },
                    };

                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.RejectedInvitation, DateTime.Now.Date, principal.User, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
                }
            }
            else
            {
                practitioner.PrincipalHierarchy = principal.UserId;
                practitioner.CoachHierarchy = principal.CoachHierarchy;
                practitioner.CoachLinkDate = DateTime.Now;
                practitioner.DateToBeRemoved = null;
                practitioner.DateAccepted = DateTime.Now;
                practitioner.IsLeaving = false;

                status.LeavingDate = null;
                status.AcceptedDate = DateTime.Now;
                status.Leaving = false;

                //notificationService.ExpireNotificationsTypesForUser(practitioner.UserId.ToString(), TemplateTypeConstants.PrincipalFAAChanged, null, null, practitioner.UserId);
            }

            notificationService.ExpireNotificationsTypesForUser(practitioner.UserId.ToString(), TemplateTypeConstants.ProgrammeInvitation);

            //update practitioner with column changes
            practitionerRepo.Update(practitioner);
            return status;
        }
    }
}
