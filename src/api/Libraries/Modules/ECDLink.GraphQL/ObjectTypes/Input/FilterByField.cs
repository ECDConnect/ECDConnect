using ECDLink.EGraphQL.ObjectTypes.Input.Enums;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class FilterByField
    {
        public string FieldName { get; set;  }
        public string Value { get; set;  }
        public InputFilterComparer? FilterType { get; set; } = InputFilterComparer.Equals;
    }
}