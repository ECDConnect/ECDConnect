using ECDLink.DataAccessLayer.Context;
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
        private AuthenticationDbContext _context;
        private DbSet<JWTUserTokensEntity> entities;
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;

        protected Guid _userId;

        protected string errorMessage = string.Empty;

        public JWTRepository(AuthenticationDbContext context)
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

            return entities.Where(g => g.TenantId == _tenantId).Any(e => string.Equals(e.TokenKey, key));
        }

        public IQueryable<JWTUserTokensEntity> GetAll()
        {
            return entities;
        }

        public virtual JWTUserTokensEntity GetByUserId(Guid id)
        {
            return entities
                    .Where(e => e.UserId == id && e.RevokedAt == null)
                    .Where(g => g.TenantId == _tenantId)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();
        }

        public virtual IList<JWTUserTokensEntity> GetAllActiveByUserId(Guid id)
        {
            return entities
                    .Where(e => e.UserId == id && e.RevokedAt == null)
                    .Where(g => g.TenantId == _tenantId)
                    .OrderByDescending(x => x.LastSeenAt)
                    .ToList();
        }

        public virtual JWTUserTokensEntity GetByKey(string key)
        {
            return entities
                    .Where(e => string.Equals(e.TokenKey, key))
                    .Where(g => g.TenantId == _tenantId)
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity GetByToken(string token)
        {
            return entities
                    .Where(e => string.Equals(e.Token, token))
                    .Where(g => g.TenantId == _tenantId)
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

        public void UpdateLastSeenByToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return;

            _context.Database.ExecuteSqlInterpolated(
                $"UPDATE \"JWTUserTokens\" SET \"LastSeenAt\" = {DateTime.UtcNow} WHERE \"Token\" = {token} AND \"TenantId\" = {_tenantId}");
        }

        public bool Revoke(string tokenKey)
        {
            if (string.IsNullOrWhiteSpace(tokenKey)) return false;

            _context.Database.ExecuteSqlInterpolated(
                $"UPDATE \"JWTUserTokens\" SET \"RevokedAt\" = {DateTime.UtcNow} WHERE \"TokenKey\" = {tokenKey} AND \"TenantId\" = {_tenantId}");

            return true;
        }

        public void Delete(string key)
        {
            if (key == null) throw new ArgumentNullException("entity");
            var entity = entities
                .Where(x => x.TokenKey.Equals(key))
                .Where(g => g.TenantId == _tenantId)
                .FirstOrDefault();
            if (entity != null)
            {
                entities.Remove(entity);
                _context.SaveChanges();
            }
        }

        public bool DeleteAllTokensById(Guid id)
        {
            var tokens = entities
                .Where(x => x.UserId == id && x.TenantId == _tenantId)
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
