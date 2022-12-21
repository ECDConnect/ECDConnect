using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Tenancy.Enums;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.PostgresTenancy.Entities
{
    public class JWTUserTokensEntityReturn
    {
        public string id { get; set; }
        public string auth_token { get; set; }
        public string expires_in { get; set; }
    }
}
