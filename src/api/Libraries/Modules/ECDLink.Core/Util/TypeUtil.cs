using System;
using System.Linq;

namespace ECDLink.Core.Util
{
    public static class TypeUtil
    {
        public static Type[] GetImplementingTypes(Type t)
        {
            var types = AppDomain.CurrentDomain.GetAssemblies()
                .Where(type => type.GetName().ToString().Contains("ECD"))
                .SelectMany(s => s.GetTypes())
                .Where(p => t.IsAssignableFrom(p) && p.IsClass && !p.IsAbstract);

            return types.ToArray();
        }
    }
}
