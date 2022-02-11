using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;

namespace ECDLink.DataAccessLayer.Repositories.Factories
{
    public interface IGenericRepositoryFactory
    {
        IGenericRepository<T, Guid> CreateRepository<T>(AuthenticationDbContext CustomScope = null, string userContext = null) where T : EntityBase<Guid>;
    }
}
