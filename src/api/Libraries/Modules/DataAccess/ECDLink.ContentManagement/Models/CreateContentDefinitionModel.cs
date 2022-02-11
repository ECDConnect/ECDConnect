using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class CreateContentDefinitionModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string MetaData { get; set; }

        public IEnumerable<CreateContentDefinitionFieldModel> Fields { get; set; }
    }

    public class CreateContentDefinitionFieldModel
    {
        public string Name { get; set; }

        public string DataLinkName { get; set; }

        public int FieldTypeId { get; set; }
    }
}
