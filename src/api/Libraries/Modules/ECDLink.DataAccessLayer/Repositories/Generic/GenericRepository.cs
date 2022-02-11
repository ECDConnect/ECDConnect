using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class GenericRepository<T> : GenericRepositoryBase<T>
      where T : EntityBase<Guid>
    {
        public GenericRepository(AuthenticationDbContext context, IDomainEventService domainEventService)
          : base(context, domainEventService)
        {
        }

    }
}
