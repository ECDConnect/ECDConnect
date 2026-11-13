using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Events;
using System;
using System.Linq;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class UserConsentRepository : GenericRepository<UserConsent>
    {
        public UserConsentRepository(AuthenticationDbContext context, IDomainEventService domainEventService)
            : base(context, domainEventService)
        {
        }

        public override UserConsent Update(UserConsent entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var dbEntity = FindExisting(entity);

            if (dbEntity == null)
            {
                return Insert(entity);
            }

            entity.Id = dbEntity.Id;
            entity.TenantId = dbEntity.TenantId;
            entity.InsertedDate = dbEntity.InsertedDate;

            if (string.IsNullOrWhiteSpace(entity.ConsentType))
            {
                entity.ConsentType = dbEntity.ConsentType;
            }

            if (!entity.CreatedUserId.HasValue)
            {
                entity.CreatedUserId = dbEntity.CreatedUserId;
            }

            context.Entry(dbEntity).CurrentValues.SetValues(entity);
            context.Entry(dbEntity).Property(e => e.InsertedDate).IsModified = false;
            context.Entry(dbEntity).Property(e => e.TenantId).IsModified = false;

            dbEntity.UpdatedDate = DateTime.Now;
            dbEntity.UpdatedBy = _userId?.ToString();

            _domainEventService.NotifyUpdate<UserConsent>(_userId?.ToString(), dbEntity);
            context.SaveChanges();

            return dbEntity;
        }

        private UserConsent FindExisting(UserConsent entity)
        {
            var byId = entity.Id != Guid.Empty
                ? entities.FirstOrDefault(x => x.Id == entity.Id)
                : null;

            if (byId != null)
            {
                return byId;
            }

            if (entity.UserId == Guid.Empty || entity.ConsentId == 0)
            {
                return null;
            }

            return entities.FirstOrDefault(x =>
                x.UserId == entity.UserId
                && x.ConsentId == entity.ConsentId
                && (x.TenantId == null || x.TenantId == entity.TenantId));
        }
    }
}
