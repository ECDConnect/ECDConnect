using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class GenericRepository<T> : GenericRepositoryBase<T>
      where T : EntityBase<Guid>
    {
        public GenericRepository(IDomainEventService domainEventService, IDbContextFactory<AuthenticationDbContext> authDbContextFactory, ILogger<GenericRepositoryBase<T>> logger)
          : base(domainEventService, authDbContextFactory, logger)
        {
        }

    }
}
