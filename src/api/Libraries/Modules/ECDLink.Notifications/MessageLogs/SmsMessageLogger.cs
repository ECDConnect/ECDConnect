using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Notifications.BulkSms;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.MessageLogs
{
    internal class SmsMessageLogger : IMessageLogger<BulkSmsMessage>
    {
        private readonly AuthenticationDbContext _dbContext;
        private readonly ILogger<SmsMessageLogger> _logger;

        public SmsMessageLogger(IDbContextFactory<AuthenticationDbContext> dbContextFactory, ILogger<SmsMessageLogger> logger)
        {
            _dbContext = dbContextFactory.CreateDbContext();
            _logger = logger;
        }

        public Guid? Log(BulkSmsMessage message, string messageTemplateType, Guid? messageLogId = null)
        {
            Guid id = messageLogId ?? Guid.NewGuid();
            try
            {
                _dbContext.MessageLogs.Add(new MessageLog()
                {
                    Id = id,
                    MessageTemplateType = messageTemplateType,
                    MessageProtocol = MessageTypeConstants.SMS,
                    From = "System",
                    To = message.To,
                    Subject = null,
                    Message = message.MessageBody,
                    FromUserId = Guid.Empty,
                    UpdatedBy = null,
                    SentByUserId = Guid.Empty,
                    TenantId = TenantExecutionContext.Tenant.Id
                });
                
                _dbContext.SaveChanges();
                return id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not log message data.");
            }
            return null;
        }

        public async Task<Guid?> LogAsync(BulkSmsMessage message, string messageTemplateType, Guid? messageLogId)
        {
            Guid id = messageLogId ?? Guid.NewGuid();
            try
            {
                _dbContext.MessageLogs.Add(new MessageLog()
                {
                    Id = id,
                    MessageTemplateType = messageTemplateType,
                    MessageProtocol = MessageTypeConstants.SMS,
                    From = "System",
                    To = message.To,
                    Subject = null,
                    Message = message.MessageBody,
                    FromUserId = Guid.Empty,
                    UpdatedBy = null,
                    SentByUserId = Guid.Empty,
                    TenantId = TenantExecutionContext.Tenant.Id
                });
                await _dbContext.SaveChangesAsync();
                return id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not log message data.");
            }

            return null;
        }
    }
}