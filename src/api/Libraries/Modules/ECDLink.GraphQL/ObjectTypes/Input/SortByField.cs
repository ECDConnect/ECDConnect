using HotChocolate.Data.Sorting;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class SortByField
    {
        public SortByField()
        {
        }

        public SortByField(string fieldName, bool descending)
        {
            FieldName = fieldName;
            Descending = descending;
        }

        public string FieldName { get; } = null;
        public bool Descending { get; } = false;
    }
}