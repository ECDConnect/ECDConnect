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
            var query = _entities.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId)).AsQueryable();

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
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.AttendanceWeekly));
                case TemplateTypeEnum.PasswordChangedByAdmin:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.PasswordChangedByAdmin));
                case TemplateTypeEnum.PasswordChangedBySelf:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.PasswordChangedBySelf));
                case TemplateTypeEnum.EmailChangedByAdmin:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.EmailChangedByAdmin));
                case TemplateTypeEnum.VerifyEmailAddress:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.VerifyEmailAddress));
                case TemplateTypeEnum.AdminPasswordChangedByOtherAdmin:
                    return query.Where(message => string.Equals(message.TemplateType, TemplateTypeConstants.SuperadminNotifyEmailChanged));
                default:
                    throw new NotImplementedException("Message template type not implement or defined in factory");
            }
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
