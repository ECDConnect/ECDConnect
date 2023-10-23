using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    [Service] UserManager<ApplicationUser> userManager,
    IGenericRepositoryFactory repoFactory,
    string firstName,
    string lastName,
    string idNumber,
    string userId)
        {
            //ensure only principals or FAAs can be assigned to be a parent of another practitioner, so they cannot be joined to themselves or unrelated users
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitionerUser = new PractitionerQueryExtension().GetPractitionerByIdNumberInternal(contextAccessor, userManager, repoFactory, idNumber);
            var principalUser = practitionerRepo.GetByUserId(userId);
            if (principalUser != null && (principalUser.IsPrincipal == true || principalUser.IsFundaAppAdmin == true)) //make sure the principal user exists and is a principal or a FAA
            {
                if (practitionerUser != null)
                {
                    Practitioner practitioner = practitionerRepo.GetByUserId(practitionerUser.Id);
                    if (practitioner != null && principalUser != null && practitioner.CoachHierarchy == principalUser.CoachHierarchy && principalUser.UserId != practitioner.UserId) //only allow the same coach line sto be added to each other,a nd the user ids are different
                    {
                        practitioner.DateLinked = DateTime.Now;
                        practitioner.PrincipalHierarchy = Guid.Parse(principalUser.UserId);
                        practitioner.IsFundaAppAdmin = false;
                        practitioner.IsPrincipal = false;
                        practitionerRepo.Update(practitioner);

                        //update users nicknames
                        var user = userManager.FindByIdAsync(practitioner.UserId).Result;
                        user.NickFirstName = firstName;
                        user.NickSurname = lastName;
                        user.NickFullName = firstName + " " + lastName;

                        userManager.UpdateAsync(user);
                    }
                    else return null;

                    return practitioner;
                }
                else return null;
            }
            else return null;
        }

        public ApplicationUser UpdatePractitionerContactInfo([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] UserManager<ApplicationUser> userManager,
            string practitionerId, string firstName, string lastName, string phoneNumber, string email)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            //update users nicknames
            var user = userManager.FindByIdAsync(practitionerId).Result;
            user.NickFirstName = firstName;
            user.NickSurname = lastName;
            user.NickFullName = firstName + " " + lastName;
            user.PhoneNumber = phoneNumber;
            user.Email = email;

            userManager.UpdateAsync(user);

            return user;
        }

        public Practitioner DeletePractitionerFromPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            string userId, string principalId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).Where(y => y.PrincipalHierarchy.Equals(principalId)).OrderBy(x => x.Id).FirstOrDefault();
            {
                practitioner.PrincipalHierarchy = null;
                practitioner.ShareInfo = false;
                practitionerRepo.Update(practitioner);
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
                List<Practitioner> allPrincipalPractitioners = practitionerRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(oldPrincipal.UserId)).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = Guid.Parse(newPrincipal.UserId);
                        practi.ShareInfo = true;
                        practitionerRepo.Update(practi);
                    }
                }
            }
            return newPrincipal;
        }

        public bool SwitchPrincipal([Service] PersonnelService personnelManager,
            [Service] UserManager<ApplicationUser> userManager,
            string oldPrincipalUserId, 
            string newPrincipalUserId)
        {
            var result = personnelManager.SwitchPrincipal(oldPrincipalUserId, newPrincipalUserId);
            return result != null;
        }

        public Principal PromotePractitionerToPrincipal([Service] PersonnelService personnelManager, 
            [Service] UserManager<ApplicationUser> userManager,
             string userId)
        {
            Practitioner practitionerToPromote = personnelManager.PromotePractitionerToPrincipal(userId);
            return personnelManager.MapPractitionerToPrincipal(practitionerToPromote);
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] PersonnelService personnelManager,
             [Service] UserManager<ApplicationUser> userManager,
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
        string practitionerId, string principalId, bool accepted)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner principal = practitionerRepo.GetByUserId(principalId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            PrincipalInvitationStatus status = new PrincipalInvitationStatus();

            //reassign all practitioners to the new principal
            if (principal != null && practitioner != null)
            {
                status.LinkedDate = practitioner.DateLinked;
                if (accepted == false)
                {
                    //reset the classroomgroups away from this practitioner and back to teh principal
                    if (principal.UserId != null && practitioner.UserId != null)
                    {
                        //Reassign all classes and programmes back to principal
                        reassignmentService.AddReassignmentForPractitioner(uId, practitioner.UserId, principal.UserId, "Removing link between Principal and Practitioner", DateTime.Now, uId, null, true);
                    }

                    status.AcceptedDate = null;
                    int hrsToReassign = int.Parse(invitationDelay.Value.InvitationCutoffDelay);
                    //if the function is run twice and the leaving date is already set, remove immediately, this is the principal confirming removal of this practitioner link
                    if (practitioner.DateToBeRemoved != null)
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
                    }
                    else
                    {
                        //reset the classroomgroups away from this practitioner and back to the principal
                        if (principal.UserId != null && practitioner.UserId != null)
                        {
                            //Reassign all classes and programmes back to principal
                            reassignmentService.AddReassignmentForPractitioner(uId, practitioner.UserId, principal.UserId, "Removing link between Principal and Practitioner", DateTime.Now, uId, null, true);
                        }

                        practitioner.DateToBeRemoved = DateTime.Now.AddHours(hrsToReassign);
                        practitioner.DateAccepted = null;
                        practitioner.IsLeaving = true;

                        status.LeavingDate = DateTime.Now.AddHours(hrsToReassign);
                        status.Leaving = true;
                    }
                    //send message of rejection
                    List<TagsReplacements> replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements() { FindValue = "PractitionerName", ReplacementValue = practitioner.User.FullName },
                        new TagsReplacements() { FindValue = "RemovalDate", ReplacementValue = DateTime.Now.AddHours(hrsToReassign).ToString() }
                    };
                    notificationService.SendNotificationAsync(null, TemplateTypeConstants.RejectedInvitation, DateTime.Now, principal.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
                }
                else
                {
                    practitioner.DateToBeRemoved = null;
                    practitioner.DateAccepted = DateTime.Now;
                    practitioner.IsLeaving = false;

                    status.LeavingDate = null;
                    status.AcceptedDate = DateTime.Now;
                    status.Leaving = false;
                }
                //update practitioner with column changes
                practitionerRepo.Update(practitioner);
            }
            else return null;

            return status;
        }

    }
}
