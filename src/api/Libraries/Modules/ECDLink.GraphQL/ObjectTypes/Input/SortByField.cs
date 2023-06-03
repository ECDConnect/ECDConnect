
using System;

namespace ECDLink.EGraphQL.ObjectTypes.Input
{
    public class SortByField
    {
        public SortByField()
        {
        }

        public SortByField(string fieldName, bool descending)
        {
            FieldName = FirstCharToUpper(fieldName);
            Descending = descending;
        }

        public string FieldName { get; } = null;
        public bool Descending { get; } = false;

        private static string FirstCharToUpper(string str) 
               => string.Create(str.Length, str, (output, input) =>
               {
                   input.CopyTo(output);
                   output[0] = char.ToUpperInvariant(input[0]);
               });
    }
}