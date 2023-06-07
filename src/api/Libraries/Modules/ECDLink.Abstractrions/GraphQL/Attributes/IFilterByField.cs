using HotChocolate.Types;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    [InterfaceType("FilterByField")]

    public interface IFilterByField
    {
        public string FieldName { get; set; }
        public InputFilterComparer? FilterType { get; set; }
        public string? Value { get; set; }
    }
}