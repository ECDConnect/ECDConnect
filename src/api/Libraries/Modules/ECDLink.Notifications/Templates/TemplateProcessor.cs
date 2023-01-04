using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.Notifications.Templates
{
    public class TemplateProcessor
    {
        private TemplateFilters _templateFilters;

        private IDictionary<string, Action<TemplateOverrideModel>> messageActions;

        private ApplicationUser _user;

        private IMessageTemplate _messageTemplate;


        private string _messageBody;

        public TemplateProcessor(TemplateFilters filters)
        {
            _templateFilters = filters;
            messageActions = new Dictionary<string, Action<TemplateOverrideModel>>();
        }

        public TemplateProcessor SetUserContext(ApplicationUser applicationUser)
        {
            _user = applicationUser;

            return this;
        }

        public TemplateProcessor SetMessageTemplate(IMessageTemplate messageTemplate)
        {
            _messageTemplate = messageTemplate;

            return this;
        }

        public TemplateProcessor SetMessageBody(string body)
        {
            _messageBody = body;

            return this;
        }

        public string Process()
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            var sb = new StringBuilder(_messageBody);

            if (!messageActions.Any())
            {
                return sb.ToString();
            }

            foreach (var kv in messageActions)
            {

                var replacement = new TemplateOverrideModel
                {
                    Value = $"{kv.Key}"
                };

                kv.Value(replacement);

                sb.Replace($"[[{kv.Key}]]", replacement.Value);
            }

            return sb.ToString();
        }

        public TemplateProcessor ParseMessageFilters(IDictionary<string, string> messageOverrides)
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            var messagePlaceholder = new Dictionary<string, string>();

            foreach (var item in _messageBody.GetMessagePlaceHolders())
            {
                messagePlaceholder.Add(item.Split(':')[0], item);
            }

            foreach (var item in messagePlaceholder)
            {
                if (!messageOverrides.ContainsKey(item.Key))
                {
                    continue;
                }

                var overrideValue = messageOverrides[item.Key];

                Action<TemplateOverrideModel> action = _templateFilters.ReplaceValue(overrideValue);

                foreach (var filterId in GetTemplateFilters(item.Value))
                {
                    var filter = GetFilter(filterId);

                    action = AddFilter(action, filter);
                }

                messageActions.Add(item.Value, action);
            }

            return this;
        }

        private Action<TemplateOverrideModel> GetFilter(string filter)
        {
            if (!filter.StartsWith(':'))
            {
                filter = $":{filter}";
            }

            switch (filter)
            {
                case TemplateFilterCommands.SHORTEN_URL:
                    return _templateFilters.ShortenUrl(_user, _messageTemplate.TemplateType);
                default:
                    //log error for no filter
                    return null;
            }
        }

        private string[] GetTemplateFilters(string key)
        {
            return key.Split(':').Skip(1).ToArray();
        }

        public Action<TemplateOverrideModel> AddFilter(Action<TemplateOverrideModel> header, Action<TemplateOverrideModel> filter)
        {
            if (filter == null)
            {
                return header;
            }

            if (header == null)
            {
                header = filter;
            }
            else
            {
                header += filter;
            }

            return header;
        }
    }
}
