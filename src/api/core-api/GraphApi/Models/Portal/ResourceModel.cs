using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ResourceModel
    {
        public string ResourceType { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Link { get; set; }
        public string LongDescription { get; set; }
        public string DataFree { get; set; }
        public string SectionType { get; set; }
        public string NumberLikes { get; set; }
        public List<Guid> AvailableLanguages { get; set; }
    }
}
