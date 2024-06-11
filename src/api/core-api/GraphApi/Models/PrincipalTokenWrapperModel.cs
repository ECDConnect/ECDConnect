using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class PrincipalTokenWrapperModel
    {
        public Guid AddedByUserId { get; set; }
        public Guid PrincipalUserId { get; set; }
        public string Token { get; set; }
    }
}
