using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using Microsoft.EntityFrameworkCore;
using System;

namespace ECDLink.DataAccessLayer.Repositories
{
    public class AuditLogRepository
    {
        protected IDbContextFactory<AuthenticationDbContext> _dbFactory;

        public AuditLogRepository(IDbContextFactory<AuthenticationDbContext> dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public void AddAuditLog(Guid auditLogTypeId, string description, Guid? userId)
        {
            using var context = _dbFactory.CreateDbContext();

            var auditLog = new AuditLog
            {
                AuditLogTypeId = auditLogTypeId,
                Description = description,
                InsertedDate = DateTime.Now,
                UserId = userId
            };

            context.AuditLogs.Add(auditLog);

            context.SaveChanges();
        }
    }
}
