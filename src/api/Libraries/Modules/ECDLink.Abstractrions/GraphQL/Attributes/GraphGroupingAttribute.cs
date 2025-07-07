using System;

namespace ECDLink.Abstractrions.GraphQL.Attributes
{
    public class GraphGroupingAttribute : Attribute
    {
        public string GroupName { get; set; }

        public GraphGroupingAttribute(string groupName)
        {
            GroupName = groupName;
        }
    }
}
