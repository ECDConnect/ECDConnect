using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.EGraphQL.Resolvers
{
    public class GenericQueryResolvers<T> where T : EntityBase<Guid>
    {
        public async Task<T> Get(
          IGenericRepositoryFactory repositoryFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          Guid id)
        {
            var repository = repositoryFactory.CreateRepository<T>();
            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            return await repository.GetByIdAsync(id);
        }

        public IEnumerable<T> GetAll(
          IGenericRepositoryFactory repositoryFactory,
          [Service] IHttpContextAccessor httpContextAccessor)
        {
            var repository = repositoryFactory.CreateRepository<T>();
            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            return repository.GetAll();
        }
    }
}
