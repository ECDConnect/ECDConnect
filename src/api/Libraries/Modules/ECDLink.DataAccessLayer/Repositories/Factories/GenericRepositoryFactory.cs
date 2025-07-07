using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Repositories.Generic;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ECDLink.DataAccessLayer.Repositories.Factories
{
    public class GenericRepositoryFactory : IGenericRepositoryFactory
    {
        private readonly IServiceProvider _provider;
        public GenericRepositoryFactory(IServiceProvider serviceProvider)
        {
            _provider = serviceProvider;
        }

        public IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope = null, Guid? userContext = null)
          where T : EntityBase<Guid>
        {
            IGenericRepository<T, Guid> repo;
            switch (typeof(T))
            {
                case var cls when typeof(IUserType).IsAssignableFrom(typeof(T)):
                    repo = _provider.GetService<GenericUserTypeRepository<T>>();
                    break;
                case var cls when typeof(IUserScoped).IsAssignableFrom(typeof(T)):
                    repo = _provider.GetService<ScopedGenericRepository<T>>();
                    break;
                default:
                    repo = _provider.GetService<GenericRepository<T>>();
                    break;
            }

            if (CustomScope != default)
            {
                repo.SetCustomScope(CustomScope);
            }

            if (userContext.HasValue && userContext.Value != Guid.Empty)
            {
                repo.SetUserContext(userContext);
            }

            return repo;
        }

        public IGenericRepository<T, Guid> CreateRepository<T>(string userContext)
          where T : EntityBase<Guid>
        {
            return CreateRepository<T>(userContext: string.IsNullOrEmpty(userContext) ? null : Guid.Parse(userContext));
        }

        public IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope, string userContext)
          where T : EntityBase<Guid>
        {
            return CreateRepository<T>(CustomScope, string.IsNullOrEmpty(userContext) ? null : Guid.Parse(userContext));
        }

        public IGenericRepository<T, Guid> CreateGenericRepository<T>(AuthenticationDbContext CustomScope = null, Guid? userContext = null, Guid? tenantContext = null)
          where T : EntityBase<Guid>
        {
            IGenericRepository<T, Guid> repo = _provider.GetService<GenericRepository<T>>();
            if (userContext.HasValue && userContext.Value != Guid.Empty)
            {
                repo.SetUserContext(userContext);
            }

            if (tenantContext.HasValue && tenantContext.Value != Guid.Empty)
            {
                repo.SetTenantContext(tenantContext);
            }
            return repo;
        }

        public IGenericRepository<T, Guid> CreateGenericRepository<T>(string userContext)
          where T : EntityBase<Guid>
        {
            return CreateGenericRepository<T>(userContext: string.IsNullOrEmpty(userContext) ? null : Guid.Parse(userContext));
        }

        public IGenericRepository<T, Guid> CreateGenericRepository<T>(AuthenticationDbContext CustomScope, string userContext)
            where T : EntityBase<Guid>
        {
            return CreateGenericRepository<T>(CustomScope, string.IsNullOrEmpty(userContext) ? null : Guid.Parse(userContext));
        }
    }
}
