using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;

namespace ECDLink.EGraphQL.Resolvers
{
    public class GenericMutationResolvers<T>
        where T : EntityBase<Guid>
    {
        public T Update([Service] IGenericRepositoryFactory repositoryFactory, [Service] IHttpContextAccessor httpContextAccessor, Guid id, T input)
        {
            var repository = repositoryFactory.CreateRepository<T>();

            input.Id = id;

            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);
            return repository.Update(input);
        }

        public T Create([Service] IGenericRepositoryFactory repositoryFactory, [Service] IHttpContextAccessor httpContextAccessor, T input)
        {
            var repository = repositoryFactory.CreateRepository<T>();

            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);
            return repository.Insert(input);
        }

        public bool Delete([Service] IGenericRepositoryFactory repositoryFactory, [Service] IHttpContextAccessor httpContextAccessor, Guid id)
        {
            var repository = repositoryFactory.CreateRepository<T>();

            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);
            try
            {
                repository.Delete(id);
                return true;
            }
            // BAD ! 
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
    }
}
