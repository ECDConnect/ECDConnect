

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    public class FilterByField
    {
        private string fieldName;

        public string FieldName { get => fieldName; set => fieldName = FirstCharToUpper(value); }
        public string Value { get; set; }
        public InputFilterComparer? FilterType { get; set; } = InputFilterComparer.Equals;
        private static string FirstCharToUpper(string str)
               => string.Create(str.Length, str, (output, input) =>
               {
                   input.CopyTo(output);
                   output[0] = char.ToUpperInvariant(input[0]);
               });
    }


}