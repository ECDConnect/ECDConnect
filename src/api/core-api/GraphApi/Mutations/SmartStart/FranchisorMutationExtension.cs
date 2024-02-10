using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class FranchisorMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Franchisor UpdateFranchisor([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         IGenericRepositoryFactory repoFactory,
         [Service] ApplicationUserManager userManager,
         string id,
         Franchisor input)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Franchisor>(userContext: uId);

            Franchisor franchisor = dbRepo.GetById(input.Id);
            {
                if (franchisor != null)
                {
                    if (input.StartDate != null)
                        franchisor.StartDate = input.StartDate;
                    if (input.AreaOfOperation != null)
                        franchisor.AreaOfOperation = input.AreaOfOperation;
                    if (input.SiteAddressId != null && input.SiteAddressId.HasValue)
                    {
                        var addressRepo = repoFactory.CreateRepository<SiteAddress>(userContext: uId);
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
                        //TODO: create address if not exists, but it really should
                    }

                    dbRepo.Update(franchisor);
                }
                return franchisor;
            }

        }
    }
}
