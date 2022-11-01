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

        public IMessageTemplate GetMessage(MessageTypeEnum messageType, TemplateTypeEnum templateType)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var query = _entities.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId)).AsQueryable();

            query = FilterTypes(query, messageType);

            query = AssignTemplate(query, templateType);

            return query.FirstOrDefault();
        }

        private IQueryable<MessageTemplate> AssignTemplate(IQueryable<MessageTemplate> query, TemplateTypeEnum templateType)
        {
            switch (templateType)
            {
                case TemplateTypeEnum.ForgotPassword:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.ForgotPassword));
                case TemplateTypeEnum.Invitation:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.Invitation));
                case TemplateTypeEnum.AuthCode:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.AuthCode));
                case TemplateTypeEnum.ThreeWeekNotLoggedOn:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.ThreeWeekNotLoggedOn));
                case TemplateTypeEnum.FourWeekNotLoggedOn:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.FourWeekNotLoggedOn));
                case TemplateTypeEnum.AttendanceWeekly:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.TrackAttendanceWeekly));
                default:
                    throw new NotImplementedException("Message template type not implement or defined in factory");
            }
        }

        private IQueryable<MessageTemplate> FilterTypes(IQueryable<MessageTemplate> query, MessageTypeEnum messageType)
        {
            switch (messageType)
            {
                case MessageTypeEnum.Sms:
                    return query.Where(type => string.Equals(type.Protocol, MessageTypeConstants.SMS));
                case MessageTypeEnum.Email:
                    return query.Where(type => string.Equals(type.Protocol, MessageTypeConstants.EMAIL));
                default:
                    throw new NotImplementedException("Message type not implement or defined in factory");
            }
        }
    }
}
