using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Notifications.Model;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.MessageLogs
{
    internal class EmailMessageLogger : IMessageLogger<IEmailMessage>
    {
        private readonly AuthenticationDbContext _dbContext;
        private readonly ILogger<EmailMessageLogger> _logger;

        public EmailMessageLogger(IDbContextFactory<AuthenticationDbContext> dbContextFactory, ILogger<EmailMessageLogger> logger)
        {
            _dbContext = dbContextFactory.CreateDbContext();
            _logger = logger;
        }

        public Guid? Log(IEmailMessage message, string messageTemplateType, Guid? messageLogId = null)
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

        public async Task<Guid?> LogAsync(IEmailMessage message, string messageTemplateType, Guid? messageLogId = null)
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