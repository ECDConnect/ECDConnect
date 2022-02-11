using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.DataAccessLayer.Hierarchy
{
    public static class HierarchyHelper
    {
        public const string HierarchyDelimiter = ".";

        public static string AppendHierarchy(string existing, string value)
        {
            return $"{existing}{value}{HierarchyDelimiter}";
        }
    }
}
