using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GenericQueryTypeExtension
    {
        //private readonly IServiceProvider serviceProvider;
        //[Permission(PermissionGroups.USER, GraphActionEnum.View)]
        //public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        //{
        //    return userManager.Users;
        //}

        //[Permission(PermissionGroups.USER, GraphActionEnum.View)]
        //public T GetByUserId([Service] IHttpContextAccessor contextAccessor,
        //    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        //    [Service] IGenericRepositoryFactory repoFactory,
        //string userId)
        //{
        //    using var scope = dbFactory.CreateDbContext();
        //    using var dbContextTransaction = scope.Database.BeginTransaction();
        //    var uId = contextAccessor.HttpContext.GetUser().Id;
        //    var dbRepo = repoFactory.CreateRepository<T>(userContext: uId);
        //    T item = new T();
        //    List<T> list = dbRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
        //    if (list.Count > 0)
        //    {
        //        item = list.FirstOrDefault();
        //    }

        //    return item;
        //}
    }
}
