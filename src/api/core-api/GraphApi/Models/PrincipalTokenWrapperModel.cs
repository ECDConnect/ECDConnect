using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PrincipalPractitionerTokenWrapperModel
    {
        public Guid AddedByUserId { get; set; }
        public Guid AddedToUserId { get; set; }
        public string Token { get; set; }
    }
}
