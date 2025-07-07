using ECDLink.Abstractrions.Notifications.Message;
using ECDLink.Notifications.Sms;
using ECDLink.Notifications.Templates;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ECDLink.Notifications.NoSms
{
    public class SmsSender : SmsSenderBase
    {
        public SmsSender(IMessageFactory messageFactory, TemplateProcessor templateProcessor, ILogger<SmsSenderBase> logger)
            : base(messageFactory, templateProcessor, new Message(), logger)
        {
        }

        override public async Task SendMessageAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(_message.To))
            {
                throw new KeyNotFoundException("No receiver address specified");
            }

            if (string.IsNullOrEmpty(_message.MessageBody))
            {
                throw new KeyNotFoundException("No message template found");
            }

            if (cancellationToken.IsCancellationRequested)
                return;

            _message.MessageBody = _templateProcessor
                                        .SetUserContext(_model)
                                        .SetMessageBody(_message.MessageBody)
                                        .SetMessageTemplate(_messageTemplate)
                                        .ParseMessageFilters(_fieldTransform)
                                        .ProcessBody();


            var content = JsonConvert.SerializeObject(_message);

            Console.WriteLine("NoSms: {0}", content);
        }
    }
}
