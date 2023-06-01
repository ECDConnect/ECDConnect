
namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class FilterByField
    {
        public FilterByField(string fieldName, string value)
        {
            FieldName = fieldName;
            Value = value;
        }

        public string FieldName { get; }
        public string Value { get; }
    }
}