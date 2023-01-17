using EcdLink.Api.CoreApi.GraphApi.Queries;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PrincipalMutationExtension
    {
        public Practitioner AddPractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
    [Service] UserManager<ApplicationUser> userManager,
    [Service] IGenericRepositoryFactory repoFactory,
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
                    if (practitioner != null && principalUser != null && (practitioner.CoachHierarchy == principalUser.CoachHierarchy) && (principalUser.UserId != practitioner.UserId)) //only allow the same coach line sto be added to each other,a nd the user ids are different
                    {
                        practitioner.DateLinked = DateTime.Now;
                        practitioner.PrincipalHierarchy = Guid.Parse(principalUser.UserId);
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
            [Service] IGenericRepositoryFactory repoFactory,
            string userId, string principalId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).Where(y => y.PrincipalHierarchy.Equals(principalId)).FirstOrDefault();
            {
                practitioner.PrincipalHierarchy = null;
                practitioner.ShareInfo = false;
                practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Practitioner RemapPrincipalToPrincipal([Service] IHttpContextAccessor contextAccessor,
     [Service] IGenericRepositoryFactory repoFactory,
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

        public Principal PromotePractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            Practitioner practitionerToPromote = new Practitioner();
            if (practitioners.Count > 0)
            {
                practitionerToPromote = practitioners.FirstOrDefault();
                practitionerToPromote.IsPrincipal = true;
                practitionerToPromote.ShareInfo = true;
                practitionerRepo.Update(practitionerToPromote);

                //now add user to principal
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRACTITIONER);
                userManager.AddToRoleAsync(user, Roles.PRINCIPAL);
            }
            return this.MapPractitionerToPrincipal(practitionerToPromote);
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            Practitioner practitionerToDemote = new Practitioner();
            if (practitioners.Count > 0)
            {
                practitionerToDemote = practitioners.FirstOrDefault();
                practitionerToDemote.IsPrincipal = false;
                practitionerRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies
                List<Practitioner> allPrincipalPractitioners = practitionerRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(userId)).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = null;
                        practi.ShareInfo = false;
                        practitionerRepo.Update(practi);
                    }
                }

                //now add user back to practitioner
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRINCIPAL);
                userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
            }

            return practitionerToDemote;
        }

        public PrincipalInvitationStatus UpdatePrincipalInvitation([Service] IHttpContextAccessor contextAccessor,
    [Service] IGenericRepositoryFactory repoFactory,
    [Service] ISystemSetting<InvitationCutoffDelayOptions> invitationDelay,
    [Service] IReassignmentService reassignmentService,
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
                        //reset the classroomgroups away from this practitioner and back to teh principal
                        if (principal.UserId != null && practitioner.UserId != null)
                        {
                            //Reassign all classes and programmes back to principal
                            reassignmentService.AddReassignmentForPractitioner(uId, practitioner.UserId, principal.UserId, "Removing link between Principal and Practitioner", DateTime.Now, uId, null, true);
                        }

                        int hrsToReassign = int.Parse(invitationDelay.Value.InvitationCutoffDelay);

                        practitioner.DateToBeRemoved = DateTime.Now.AddHours(hrsToReassign);
                        practitioner.DateAccepted = null;
                        practitioner.IsLeaving = true;

                        status.LeavingDate = DateTime.Now.AddHours(hrsToReassign);
                        status.Leaving = true;
                    }
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

        public Principal MapPractitionerToPrincipal(Practitioner practitioner)
        {
            Principal userToMap = new Principal()
            {
                Id = practitioner.Id,
                IsActive = practitioner.IsActive,
                InsertedDate = practitioner.InsertedDate,
                UpdatedBy = practitioner.UpdatedBy,
                UpdatedDate = practitioner.UpdatedDate,
                Hierarchy = practitioner.Hierarchy,
                AttendanceRegisterLink = practitioner.AttendanceRegisterLink,
                MaxChildren = practitioner.MaxChildren,
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner?.ParentFees,
                LanguageUsedInGroups = practitioner?.LanguageUsedInGroups,
                StartDate = practitioner.StartDate,
                MonthSinceFranchisee = practitioner?.MonthSinceFranchisee,
                UserId = practitioner.UserId,
                SiteAddressId = practitioner?.SiteAddressId,
                IsPrincipal = true,
                CoachHierarchy = practitioner?.CoachHierarchy,
                IsFundaAppAdmin = practitioner?.IsFundaAppAdmin,
                IsTrainee = practitioner?.IsTrainee,
                SigningSignature = practitioner?.SigningSignature,
                ShareInfo = practitioner?.ShareInfo,
                IsRegistered = practitioner.IsRegistered,
            };

            return userToMap;
        }

    }
}
