using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Notifications.BulkSms;
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
        private readonly AuthenticationDbContext _context;
        private readonly DbSet<MessageLog> _messageLog;
        private ILogger<EmailMessageLogger> _logger;

        public EmailMessageLogger(IDbContextFactory<AuthenticationDbContext> dbContextFactory, ILogger<EmailMessageLogger> logger)
        {
            _context = dbContextFactory.CreateDbContext();
            _messageLog = _context.Set<MessageLog>();
            _logger = logger;
        }

        public bool Log(IEmailMessage message, string messageTemplateType)
        {
            int result = 0;
            try
            {
                _messageLog.Add(new MessageLog()
                {
                    Id = Guid.NewGuid(),
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

                result = _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not log message data.");
            }

            return result == 1;
        }

        public async Task<bool> LogAsync(IEmailMessage message, string messageTemplateType)
        {
            int result = 0;
            try
            {
                _messageLog.Add(new MessageLog()
                {
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
                result = await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not log message data.");
            }

            return result == 1;
        }
    }
}