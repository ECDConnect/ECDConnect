using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.PostgresTenancy.Repository
{
    public class JWTRepository : IJWTRepository
    {
        private PostgresTenancyContext _context;
        private DbSet<JWTUserTokensEntity> entities;
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;

        protected string _userId;

        protected string errorMessage = string.Empty;

        public JWTRepository(PostgresTenancyContext context)
        {
            _context = context;
            entities = context.Set<JWTUserTokensEntity>();
        }

        public bool dbCreated()
        {
            return _context.Database.GetService<IRelationalDatabaseCreator>().Exists();
        }

        public bool Exists(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }

            return entities.Where(g => string.Equals(g.TenantId, _tenantId)).Any(e => string.Equals(e.TokenKey, key));
        }

        public IQueryable<JWTUserTokensEntity> GetAll()
        {
            return entities;
        }

        public virtual JWTUserTokensEntity GetByUserId(string id)
        {
            return entities
                    .Where(e => string.Equals(e.UserId, id))
                    .Where(g => string.Equals(g.TenantId, _tenantId))
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity GetByKey(string key)
        {
            return entities
                    .Where(e => string.Equals(e.TokenKey, key))
                    .Where(g => string.Equals(g.TenantId, _tenantId))
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity GetByToken(string token)
        {
            return entities
                    .Where(e => string.Equals(e.Token, token))
                    .Where(g => string.Equals(g.TenantId, _tenantId))
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity Insert(JWTUserTokensEntity entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            entity.TenantId = _tenantId;
            entities.Add(entity);
            _context.SaveChanges();

            return entity;
        }

        public void Delete(string key)
        {
            if (key == null) throw new ArgumentNullException("entity");
            JWTUserTokensEntity entity = entities.Where(x => x.TokenKey.Equals(key)).Where(g => string.Equals(g.TenantId, _tenantId)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            entities.Remove(entity);
            _context.SaveChanges();

        }

        public bool DeleteAllTokensById(string id)
        {
            if (id == null) throw new ArgumentNullException("id");

            List<JWTUserTokensEntity> tokens = entities.Where(
                x => x.UserId == id
                && x.TenantId == _tenantId)
                .AsNoTracking()
                .ToList();
            
            if (tokens?.Any() ?? false)
            {
                entities.RemoveRange(tokens);
                _context.SaveChanges();
            }

            return true;
        }
    }
}
