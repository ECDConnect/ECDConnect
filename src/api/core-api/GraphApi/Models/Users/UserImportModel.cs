using HotChocolate;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class UserImportModel
    {
        [GraphQLDescription("Rows of errors.")]
        public List<InputValidationError> ValidationErrors { get; set; }
        public List<string> CreatedUsers { get; set; }
    }


}
