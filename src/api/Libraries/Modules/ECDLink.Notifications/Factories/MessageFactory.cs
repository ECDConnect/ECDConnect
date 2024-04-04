using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ECDLink.Notifications.Factories
{
    public class MessageFactory : IMessageFactory
    {
        protected readonly AuthenticationDbContext _context;
        private DbSet<MessageTemplate> _entities;

        public MessageFactory(AuthenticationDbContext context)
        {
            _context = context;
            _entities = context.MessageTemplates;
        }

        public IMessageTemplate GetMessageTemplate(MessageProtocolEnum messageProtocol, TemplateTypeEnum templateType)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var query = _entities.Where(e => e.TenantId == null || e.TenantId == tenantId).AsQueryable();

            query = FilterTypes(query, messageProtocol);
            query = AssignTemplate(query, templateType);
            
            // If both null tenant and tenantId found, result will be unpredictable without this:
            // sort current tenant before null tenant
            query = query.OrderBy(q => q.TenantId)
                .ThenBy(q => q.TemplateType)
                .ThenBy(q => q.Protocol);
            
            return query.FirstOrDefault();
        }

        private IQueryable<MessageTemplate> AssignTemplate(IQueryable<MessageTemplate> query, TemplateTypeEnum templateType)
        {
            var stringConst = typeof(TemplateTypeConstants).GetField(templateType.ToString())?.GetValue(null)?.ToString();
            
            if (stringConst is null)
                throw new ArgumentOutOfRangeException(nameof(templateType), "Message template type not implement or defined in factory");

            return query.Where(message => string.Equals(message.TemplateType, stringConst));
        }

        private IQueryable<MessageTemplate> FilterTypes(IQueryable<MessageTemplate> query, MessageProtocolEnum messageProtocol)
        {
            switch (messageProtocol)
            {
                case MessageProtocolEnum.Sms:
                    return query.Where(type => string.Equals(type.Protocol, MessageTypeConstants.SMS));
                case MessageProtocolEnum.Email:
                    return query.Where(type => string.Equals(type.Protocol, MessageTypeConstants.EMAIL));
                default:
                    throw new NotImplementedException("Message type not implement or defined in factory");
            }
        }
    }
}
