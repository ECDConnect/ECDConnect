using HotChocolate.Types;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    [InterfaceType("SortByField")]
    public interface ISortByField
    {
        public bool Descending { get; }
        public string FieldName { get; }
    }
}