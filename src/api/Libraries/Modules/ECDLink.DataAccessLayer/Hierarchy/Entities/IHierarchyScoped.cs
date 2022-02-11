using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.DataAccessLayer.Hierarchy.Entities
{
    public interface IHierarchyScoped
    {
        public string Hierarchy { get; set; }
    }
}
