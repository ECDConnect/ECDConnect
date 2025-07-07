using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class InputValidationError
    {
        public InputValidationError(int row, IEnumerable<string> errors, string errorDescription = null)
        {
            Row = row;
            Errors = errors;
            ErrorDescription = errorDescription;
        }

        public int Row { get; set; }
        public IEnumerable<string> Errors { get; set; }
        public string ErrorDescription { get; set; }
    }


}
