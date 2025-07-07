using ECDLink.ContentManagement.Entities;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Configuration.Setup
{
    internal static class ContentStatusSeed<T>
    where T : ContentStatus, new()
    {
        internal static IList<T> GetContentStatuses()
        {
            return new List<T>()
      {
        new T
        {
          Name = "Draft",
          Description = "Draft"
        },
        new T
        {
          Name = "Published",
          Description = "Published"
        },
        new T
        {
          Name = "Rejected",
          Description = "Rejected"
        },
      };
        }
    }
}

