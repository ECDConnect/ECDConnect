namespace ECDLink.Core.Models.ContentManagement
{
    public class FieldDefinitionModel
    {
        public int FieldTypeId { get; set; }

        public string DataType { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public bool DisplayMainTable { get; set; }
        public bool DisplayPage { get; set; }
        public bool IsRequired { get; set; }
        public string AssemblyDataTypeName { get; set; }
        public string GraphDataTypeName { get; set; }
    }
}
