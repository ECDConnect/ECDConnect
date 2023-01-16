using ECDLink.DataAccessLayer.Entities.Workflow;
using System;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Workflow
{
    internal static class WorkflowStatusTypeSeedConstants
    {
        public static Guid Document = Guid.Parse("da137212-2f69-466a-83a8-c3cb713222a6");
        public static Guid Child = Guid.Parse("6b0a848a-a852-4584-bf4e-0e9a3568d292");
    }

    internal static class WorkflowStatusTypeSeed<T>
    where T : WorkflowStatusType, new()
    {
        internal static IList<T> GetWorkflowStatuses()
        {
            return new List<T>()
            {
                new T
                {
                    Id = WorkflowStatusTypeSeedConstants.Document,
                    Description = "Document"
                },
                new T
                {
                    Id = WorkflowStatusTypeSeedConstants.Child,
                    Description = "Child"
                }
            };
        }
    }
}
