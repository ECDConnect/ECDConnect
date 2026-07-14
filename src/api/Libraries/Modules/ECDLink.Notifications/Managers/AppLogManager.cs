using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Managers
{
    public class AppLogManager
    {
        private readonly AuthenticationDbContext _dbContext;
        private readonly ILogger<AppLogManager> _logger;

        public AppLogManager(AuthenticationDbContext dbContext, ILogger<AppLogManager> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task LogErrorAsync(string type, string message, Guid? userId, string? payload = null, string? requestPayload = null)
        {
            // Callers (e.g. SMS senders) may pass the Id of a not-yet-persisted
            // ApplicationUser (pre-signup OTP flow), which would otherwise violate
            // FK_AppLog_AspNetUsers_UserId.
            if (userId.HasValue && !await _dbContext.Users.AnyAsync(u => u.Id == userId.Value))
            {
                userId = null;
            }

            _dbContext.AppLog.Add(new AppLog
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                InsertedDate = DateTime.Now,
                EventDate = DateTime.Now,
                Type = type,
                Message = message,
                Payload = payload,
                RequestPayload = requestPayload,
            });

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Logging is best-effort: a failure here (e.g. UserId not yet persisted
                // to AspNetUsers) must never take down the caller's real error path.
                _logger.LogWarning(ex, "Failed to persist AppLog entry of type {Type}", type);
            }
        }
    }
}
