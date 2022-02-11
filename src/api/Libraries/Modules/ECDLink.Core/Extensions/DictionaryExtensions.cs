using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;

namespace ECDLink.Core.Extensions
{
    public static class DictionaryExtensions
    {
        public static Object ToObject(this Dictionary<string, string> dictionary)
        {
            return dictionary.Aggregate(new ExpandoObject() as IDictionary<string, object>,
                                  (a, p) => { a.Add(p.Key, p.Value); return a; });
        }
    }
}
