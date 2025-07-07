using System;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class ContentGroup
    {
        public Guid LocaleId { get; set; }
        public List<object> Content { get; set; }
    }
}
