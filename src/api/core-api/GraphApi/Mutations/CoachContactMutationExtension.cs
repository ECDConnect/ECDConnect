
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
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
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CoachContactMutationExtension
    {      
        [Permission(PermissionGroups.COACH, GraphActionEnum.Update)]
        public bool SaveCoachContact([Service] IHttpContextAccessor contextAccessor,
          [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          AuthenticationDbContext dbContext,
          IGenericRepositoryFactory repoFactory,
          Guid practitionerId,
          int actionItemType,
          DateTime period)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var contactRepo = repoFactory.CreateGenericRepository<CoachContact>(userContext: uId);

            if (practitionerId == Guid.Empty)
            {
                throw new ArgumentNullException("practitionerId", "PractitionerId is null");
            }

            var practitioner = dbContext.Practitioners.AsNoTracking().FirstOrDefault(x => x.UserId == practitionerId && x.IsActive);

            if (practitioner == null)
            {
                throw new ArgumentNullException("practitioner", "Practitioner is null");
            }

            Coach coach = dbRepo.GetByUserId(uId);
            if (coach == null)
            {
                throw new ArgumentException("Coach not found for user");
            }

            var contact = contactRepo.GetAll().FirstOrDefault(c => c.PractitionerId == practitionerId && c.CoachId == coach.Id && c.ActionItemType == (ActionItemType)actionItemType && c.Period == period);
            if (contact != null)
            {
                contact.ContactedDate = DateTime.UtcNow;
                contact.UpdatedDate = DateTime.UtcNow;
                contactRepo.Update(contact);
            }
            else
            {
                CoachContact newContact = new CoachContact
                {
                    Id = Guid.NewGuid(),
                    CoachId = coach.Id,
                    PractitionerId = practitioner.Id,
                    ActionItemType = (ActionItemType)actionItemType,
                    Period = period,
                    ContactedDate = DateTime.UtcNow,
                    IsActive = true,
                    UserId = uId,
                    InsertedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow,
                };
                contactRepo.Insert(newContact);
            }          

            return true; 
        }
    }
}
