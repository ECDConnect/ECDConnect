using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ECDLink.Notifications.Model
{
    public abstract class NotificationBase<T>
    {
        protected T _model;

        protected IDictionary<string, string> _fieldTransform;

        protected IMessageTemplate _messageTemplate;

        protected void AddUserFieldOverrides(string messageTemplate)
        {
            var replaceFields = messageTemplate.GetMessagePlaceHolders();

            var ignoreFunctionTags = replaceFields.Select(x => x.Split(':')[0]);

            var allProperties = typeof(T).GetProperties();

            foreach (var field in ignoreFunctionTags)
            {
                var property = allProperties.FirstOrDefault(x => string.Equals(x.Name, field, StringComparison.OrdinalIgnoreCase));

                if (property != default(PropertyInfo))
                {
                    var value = property.GetValue(_model)?.ToString() ?? string.Empty;

                    _fieldTransform.Add(field, value);
                }
            }
        }
    }
}
