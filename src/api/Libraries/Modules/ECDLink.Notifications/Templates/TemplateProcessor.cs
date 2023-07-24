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
        private IDictionary<string, Action<ITemplateOverrideModel>> messageActions;
        private IDictionary<string, Action<ITemplateOverrideModel>> messageSubjectActions;
        private ApplicationUser _user;
        private IMessageTemplate _messageTemplate;

        private string _messageBody;
        private string _messageSubject;

        public TemplateProcessor(TemplateFilters filters)
        {
            // TODO: Why is this called constatnly?
            _templateFilters = filters;
            messageActions = new Dictionary<string, Action<ITemplateOverrideModel>>();
            messageSubjectActions = new Dictionary<string, Action<ITemplateOverrideModel>>();
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

        public TemplateProcessor SetMessageSubject(string subject)
        {
            _messageSubject = subject;

            return this;
        }

        public string ProcessBody(string startToken = null, string endToken = null)
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            return ProcessText(_messageBody, messageActions, startToken, endToken);
        }

        public string ProcessSubject(string startToken = null, string endToken = null)
        {
            // some message types do not have "subjects"
            if (string.IsNullOrWhiteSpace(_messageSubject))
            {
                return "";
            }

            return ProcessText(_messageSubject, messageSubjectActions, startToken, endToken);
        }

        public string ProcessText(string text, IDictionary<string, Action<ITemplateOverrideModel>> ationDictionary, string startToken = null, string endToken = null)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return "";
            }

            // TODO: Use span
            var resultText = new StringBuilder(text);

            if (ationDictionary?.Any() != true)
            {
                return resultText.ToString();
            }

            foreach (var kv in ationDictionary)
            {

                var replacement = new TemplateOverrideModel
                {
                    Value = $"{kv.Key}"
                };

                kv.Value(replacement);

                resultText.Replace($"{startToken ?? "[["}{kv.Key}{endToken ?? "]]"}", replacement.Value);
            }

            return resultText.ToString();
        }

        public TemplateProcessor ParseMessageFilters(IDictionary<string, string> messageOverrides)
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            var bodyFilters = ParseMessageFilterText(_messageBody, messageOverrides);
            foreach (var p in bodyFilters)
            {
                var added = messageActions.TryAdd(p.Key, p.Value);
            }
            
            var subjectFilters = ParseMessageFilterText(_messageSubject, messageOverrides);
            
            foreach (var p in subjectFilters ?? new Dictionary<string, Action<ITemplateOverrideModel>>())
            {
                var added = messageSubjectActions.TryAdd(p.Key, p.Value);
            }

            return this;
        }

        public IDictionary<string, Action<ITemplateOverrideModel>> ParseMessageFilterText(string text, IDictionary<string, string> messageOverrides)
        {
            var messageActions = new Dictionary<string, Action<ITemplateOverrideModel>>();
            
            if (string.IsNullOrWhiteSpace(text))
            {
                return messageActions;
            }

            foreach (var item in text.GetMessagePlaceHolders())
            {
                var key = item.Split(':')?[0];
                if (key is null || !messageOverrides.ContainsKey(key))
                {
                    continue;
                }

                var overrideValue = messageOverrides[key];

                Action<ITemplateOverrideModel> action = _templateFilters.ReplaceValue(overrideValue);

                foreach (var filterId in GetTemplateFilters(item))
                {
                    var filter = GetFilter(filterId);

                    action = AddFilter(action, filter);
                }

                messageActions.Add(item, action);
            }

            return messageActions;
        }

        private Action<ITemplateOverrideModel> GetFilter(string filter)
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

        public Action<ITemplateOverrideModel> AddFilter(Action<ITemplateOverrideModel> header, Action<ITemplateOverrideModel> filter)
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
