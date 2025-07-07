using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;

namespace ECDLink.DataAccessLayer.Repositories.Factories
{
    public interface IGenericRepositoryFactory
    {
        IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope = null, Guid? userContext = null) where T : EntityBase<Guid>;
        IGenericRepository<T, Guid> CreateRepository<T>(string userContext) where T : EntityBase<Guid>;
        IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope, string userContext) where T : EntityBase<Guid>;
        IGenericRepository<T, Guid> CreateGenericRepository<T>(AuthenticationDbContext CustomScope = null, Guid? userContext = null, Guid? tenantContext = null) where T : EntityBase<Guid>;
        IGenericRepository<T, Guid> CreateGenericRepository<T>(string userContext) where T : EntityBase<Guid>;
        IGenericRepository<T, Guid> CreateGenericRepository<T>(AuthenticationDbContext CustomScope, string userContext) where T : EntityBase<Guid>;
    }
}
