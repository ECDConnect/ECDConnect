using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace ECDLink.EGraphQL.Resolvers
{
    public class GenericQueryResolvers<T> where T : EntityBase<Guid>
    {
        public T Get(
          [Service] IGenericRepositoryFactory repositoryFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          Guid id)
        {
            var repository = repositoryFactory.CreateRepository<T>();
            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            return repository.GetById(id);
        }

        public IEnumerable<T> GetAll(
          [Service] IGenericRepositoryFactory repositoryFactory,
          [Service] IHttpContextAccessor httpContextAccessor)
        {
            var repository = repositoryFactory.CreateRepository<T>();
            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);

            return repository.GetAll();
        }
    }
}
