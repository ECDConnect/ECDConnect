using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace ECDLink.EGraphQL.Resolvers
{
    public class GenericMutationResolvers<T>
        where T : EntityBase<Guid>
    {
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;
        public T Update(
            IGenericRepositoryFactory repositoryFactory, 
            [Service] IHttpContextAccessor httpContextAccessor, 
            Guid id, T input)
        {
            var repository = repositoryFactory.CreateRepository<T>();
            if (input.UpdatedDate == default(DateTime)) { input.UpdatedDate = DateTime.Now; }
            input.UpdatedDate = DateTime.Now;
            input.Id = id;
            input.TenantId = _tenantId;

            var inputProperties = input?.GetType().GetProperties().Where(p => p.PropertyType == typeof(Guid?));
            foreach (var property in inputProperties)
            {
                if (property.GetValue(input) as Guid? == Guid.Empty)
                    property.SetValue(input, null);
            }

            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);
            return repository.Update(input);
        }

        public T Create(
            IGenericRepositoryFactory repositoryFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            T input)
        {
            var repository = repositoryFactory.CreateRepository<T>();

            repository.SetUserContext(httpContextAccessor.HttpContext.GetUser().Id);
            input.TenantId = _tenantId;

            return repository.Insert(input);
        }

        public bool Delete(
            IGenericRepositoryFactory repositoryFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            Guid id)
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
