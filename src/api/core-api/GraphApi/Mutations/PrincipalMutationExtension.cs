using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Queries;
using ECDLink.Tenancy.Context;
using Microsoft.Azure.Documents;
using System.Collections.Concurrent;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PrincipalMutationExtension
    {

        public Practitioner AddPractitionerToPrincipal([Service] IServiceProvider serviceProvider, [Service] IHttpContextAccessor contextAccessor,
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
            var practitionerOwnerRepo = repoFactory.CreateGenericRepository<PractitionerOwner>(userContext: uId);
            var practitionerUser = new PractitionerQueryExtension().GetPractitionerByIdNumberInternal(contextAccessor,userManager, repoFactory, idNumber);
            var principalUser = practitionerRepo.GetByUserId(userId);
            if (principalUser != null && (principalUser.IsPrincipal == true || principalUser.IsFundaAppAdmin == true)) //make sure the principal user exists and is a principal or a FAA
            {
                if (practitionerUser != null)
                {
                    Practitioner practitioner = practitionerRepo.GetByUserId(practitionerUser.Id);
                    if (practitioner != null && principalUser != null && (practitioner.CoachHierarchy == principalUser.CoachHierarchy)) //only allow the same coach line sto be added to each other
                    {
                        if (principalUser.UserId != practitioner.UserId)//only assign principals and fundaapadmins to another practitioner as a parent
                        {
                            practitioner.PrincipalHierarchy = Guid.Parse(principalUser.UserId);
                            var practitionerUpdateResult = practitionerRepo.Update(practitioner);

                            //buuld link up between practitioner and principal
                            var owner = new PractitionerOwner()
                            {
                                UserId = principalUser.UserId,
                                PrincipalOwnerId = Guid.Parse(principalUser.UserId),
                                PractitionerId = Guid.Parse(practitioner.UserId),
                                DateLinked = DateTime.Now,
                                DateToBeRemoved = DateTime.Now.AddDays(7)
                            };
                            practitionerOwnerRepo.Insert(owner);

                            //update users nicknames
                            var user = userManager.FindByIdAsync(practitioner.UserId).Result;
                            user.NickFirstName = firstName;
                            user.NickSurname = lastName;
                            user.NickFullName = firstName + " " + lastName;

                            var userUpdateResult = userManager.UpdateAsync(user).Result;
                        }
                        else return null;
                    }
                    else return null;

                    return practitioner;
                }
                else return null;
                //{
                //    //Create basic user and practitioner
                //    var pracRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

                //    var pOne = new ApplicationUser
                //    {
                //        FirstName = firstName,
                //        Surname = lastName,
                //        FullName = firstName + " " + lastName,
                //        UserName = idNumber,
                //        IdNumber = idNumber,
                //        IsActive = true,
                //        NickFirstName = firstName,
                //        NickSurname = lastName,
                //        NickFullName = firstName + " " + lastName,
                //        TenantId = tenantId
                //    };

                //    var result = userManager.CreateAsync(pOne).Result;
                //    string practitionerId = pOne.Id;

                //    var passwordResult = userManager.AddPasswordAsync(pOne, idNumber).Result;

                //    pracRepo.Insert(new Practitioner
                //    {
                //        Id = Guid.NewGuid(),
                //        UserId = practitionerId,
                //        IsPrincipal = false,
                //        PrincipalHierarchy = Guid.Parse(principalUser.UserId),
                //        IsRegistered = true,
                //        TenantId = tenantId
                //    });

                //    return new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, repoFactory, practitionerId);
                //}
            } else return null;
        }

        public ApplicationUser UpdatePractitionerContactInfo([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, string firstName, string lastName, string phoneNumber, string email)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            //update users nicknames
            var user = userManager.FindByIdAsync(practitionerId).Result;
            user.NickFirstName = firstName;
            user.NickSurname = lastName;
            user.NickFullName = firstName + " " + lastName;    
            user.PhoneNumber = phoneNumber;
            user.Email = email;

            var userUpdateResult = userManager.UpdateAsync(user).Result;

            return user;
        }

        public Practitioner DeletePractitionerFromPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
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
                var updateResult = practitionerRepo.Update(practitioner);
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
                var updateResult = practitionerRepo.Update(practitionerToPromote);

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
                var updateResult = practitionerRepo.Update(practitionerToDemote);

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

        public Practitioner UpdatePrincipalInvitation([Service] IHttpContextAccessor contextAccessor,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    string practitionerId, string principalId, bool accepted)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitionerOwnerRepo = repoFactory.CreateRepository<PractitionerOwner>(userContext: uId);
            Practitioner principal = practitionerRepo.GetByUserId(principalId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);

            //reassign all practitioners to the new principal
            if (principal != null && practitioner != null)
            {
                var link = practitionerOwnerRepo.GetAll().Where(x => x.PrincipalOwnerId.Equals(principal.UserId)).Where(x => x.PractitionerId.Equals(practitioner.UserId)).Where(x => x.DateAccepted != null).FirstOrDefault();
                if (accepted == false)
                {
                    practitioner.PrincipalHierarchy = null;
                    practitioner.ShareInfo = false;
                    var updateResult = practitionerRepo.Update(practitioner);

                    if (link != null)
                    {
                        link.DateToBeRemoved = DateTime.Now;
                        practitionerOwnerRepo.Update(link);
                    }
                } else
                {
                    if (link != null)
                    {
                        link.DateAccepted = DateTime.Now;
                        practitionerOwnerRepo.Update(link);
                    }
                }
                //now kill the practitionerowner row
                
                if (link != null)
                {
                    link.DateToBeRemoved = DateTime.Now;

                    practitionerOwnerRepo.Update(link);
                }
            }

            return practitioner;
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
                //Signature = practitioner.Signature,
                //PrincipalHierarchy = practitioner?.PrincipalHierarchy,           
            };

            return userToMap;
        }

    }
}
