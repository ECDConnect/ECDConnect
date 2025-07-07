using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace ECDLink.Core.Extensions
{
    public static class GuidExtensions
    {
        public static string ToStringOrNull(this Guid? _this)
        {
            if (_this == null || !_this.HasValue) return null;
            return _this.Value.ToString();
        }
    }
}
