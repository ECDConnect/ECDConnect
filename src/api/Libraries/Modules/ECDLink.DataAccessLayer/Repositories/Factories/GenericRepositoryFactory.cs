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

        public IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope = null, string userContext = null)
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

            if (!string.IsNullOrWhiteSpace(userContext))
            {
                repo.SetUserContext(userContext);
            }

            return repo;
        }
        public IGenericRepository<T, Guid> CreateGenericRepository<T>(AuthenticationDbContext CustomScope = null, string userContext = null)
          where T : EntityBase<Guid>
        {
            IGenericRepository<T, Guid> repo = _provider.GetService<GenericRepository<T>>();
            if (!string.IsNullOrWhiteSpace(userContext))
            {
                repo.SetUserContext(userContext);
            }
            return repo;
        }
    }
}
