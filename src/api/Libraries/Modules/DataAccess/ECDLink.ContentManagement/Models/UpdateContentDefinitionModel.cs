using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class UpdateContentDefinitionModel
    {
        public int Id { get; set; }
        // Maybe not allow them to change name, we will see
        public string Name { get; set; }
        public string Description { get; set; }
        public string MetaData { get; set; }

        public IEnumerable<UpdateContentDefinitionFieldModel> Fields { get; set; }
    }

    public class UpdateContentDefinitionFieldModel
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public int FieldTypeId { get; set; }

        public bool FlagUpdate { get; set; }

        public bool FlagDelete { get; set; }
    }
}
