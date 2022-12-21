using System.Collections.Generic;

namespace ECDLink.Core.Models.ContentManagement
{
    public class ContentDefinitionModel
    {
        public string ContentName { get; set; }

        public string Identifier { get; set; }

        public IEnumerable<FieldDefinitionModel> Fields { get; set; }

    }
}
