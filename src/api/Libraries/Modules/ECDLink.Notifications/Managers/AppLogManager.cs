using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Managers
{
    public class AppLogManager
    {
        private readonly AuthenticationDbContext _dbContext;

        public AppLogManager(AuthenticationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task LogErrorAsync(string type, string message, Guid? userId, string? payload = null, string? requestPayload = null)
        {
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

            await _dbContext.SaveChangesAsync();
        }
    }
}
