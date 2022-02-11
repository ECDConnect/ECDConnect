using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.Extensions
{
    public static class ConfigurationExtensions
    {
        public static T GetSection<T>(this IConfiguration config, string key)
            where T : class, new()
        {
            var obj = new T();

            config.GetSection(key).Bind(obj);

            return obj;
        }
    }
}
