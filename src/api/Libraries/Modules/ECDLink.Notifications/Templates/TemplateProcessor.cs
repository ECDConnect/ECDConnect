using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Templates
{
    public class TemplateProcessor
    {
        private readonly TemplateFilters _templateFilters;
        private readonly IDictionary<string, Func<ITemplateOverrideModel, Task>> messageActions;
        private readonly IDictionary<string, Func<ITemplateOverrideModel, Task>> messageSubjectActions;
        private ApplicationUser _user;
        private IMessageTemplate _messageTemplate;

        private string _messageBody;
        private string _messageSubject;

        public TemplateProcessor(TemplateFilters filters)
        {
            _templateFilters = filters;
            messageActions = new Dictionary<string, Func<ITemplateOverrideModel, Task>>();
            messageSubjectActions = new Dictionary<string, Func<ITemplateOverrideModel, Task>>();
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

        public async Task<string> ProcessBody(string startToken = null, string endToken = null)
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            return await ProcessText(_messageBody, messageActions, startToken, endToken);
        }

        public async Task<string> ProcessSubject(string startToken = null, string endToken = null)
        {
            // some message types do not have "subjects"
            if (string.IsNullOrWhiteSpace(_messageSubject))
            {
                return "";
            }

            return await ProcessText(_messageSubject, messageSubjectActions, startToken, endToken);
        }

        public async Task<string> ProcessText(string text, IDictionary<string, Func<ITemplateOverrideModel, Task>> actionDictionary, string startToken = null, string endToken = null)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return "";
            }

            // TODO: Use span
            var resultText = new StringBuilder(text);

            if (actionDictionary?.Any() != true)
            {
                return resultText.ToString();
            }

            foreach (var kv in actionDictionary)
            {

                var replacement = new TemplateOverrideModel
                {
                    Value = $"{kv.Key}"
                };

                await kv.Value(replacement);

                resultText.Replace($"{startToken ?? "[["}{kv.Key}{endToken ?? "]]"}", replacement.Value);
            }

            return resultText.ToString();
        }

        public TemplateProcessor ParseMessageFilters(IDictionary<string, string> messageOverrides, Guid? messageLogId = null)
        {
            if (string.IsNullOrWhiteSpace(_messageBody))
            {
                throw new Exception("No Message Body Specified");
            }

            var bodyFilters = ParseMessageFilterText(_messageBody, messageOverrides, messageLogId);
            foreach (var p in bodyFilters)
            {
                messageActions.TryAdd(p.Key, p.Value);
            }
            
            var subjectFilters = ParseMessageFilterText(_messageSubject, messageOverrides, messageLogId);
            
            foreach (var p in subjectFilters ?? new Dictionary<string, Func<ITemplateOverrideModel, Task>>())
            {
                messageSubjectActions.TryAdd(p.Key, p.Value);
            }

            return this;
        }

        public IDictionary<string, Func<ITemplateOverrideModel, Task>> ParseMessageFilterText(string text, IDictionary<string, string> messageOverrides, Guid? messageLogId = null)
        {
            var messageActions = new Dictionary<string, Func<ITemplateOverrideModel, Task>>();
            
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

                Func<ITemplateOverrideModel, Task> action = _templateFilters.ReplaceValue(overrideValue);

                foreach (var filterId in GetTemplateFilters(item))
                {
                    var filter = GetFilter(filterId, messageLogId);

                    action = AddFilter(action, filter);
                }

                messageActions.Add(item, action);
            }

            return messageActions;
        }

        private Func<ITemplateOverrideModel, Task> GetFilter(string filter, Guid? messageLogId)
        {
            if (!filter.StartsWith(':'))
            {
                filter = $":{filter}";
            }

            switch (filter)
            {
                case TemplateFilterCommands.SHORTEN_URL:
                    return _templateFilters.ShortenUrl(_user, _messageTemplate.TemplateType, messageLogId);
                default:
                    //log error for no filter
                    return null;
            }
        }

        private string[] GetTemplateFilters(string key)
        {
            return key.Split(':').Skip(1).ToArray();
        }

        public Func<ITemplateOverrideModel, Task> AddFilter(Func<ITemplateOverrideModel, Task> header, Func<ITemplateOverrideModel, Task> filter)
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
