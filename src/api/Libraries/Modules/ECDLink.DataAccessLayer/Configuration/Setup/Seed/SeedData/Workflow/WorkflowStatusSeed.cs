using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Workflow;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedData.Workflow
{
    internal static class WorkflowStatusSeed<T>
        where T : WorkflowStatus, new()
    {
        internal static IList<T> GetWorkflowStatuses()
        {
            return new List<T>()
            {
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Document,
                  Description = "Pending Upload",
                  EnumId = WorkflowStatusEnum.DocumentPendingUpload,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Document,
                  Description = "Pending Verification",
                  EnumId = WorkflowStatusEnum.DocumentPendingVerification,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Document,
                  Description = "Declared",
                  EnumId = WorkflowStatusEnum.DocumentDeclared,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Document,
                  Description = "Verified",
                  EnumId = WorkflowStatusEnum.DocumentVerified,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Child,
                  Description = "Active",
                  EnumId = WorkflowStatusEnum.ChildActive,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Child,
                  Description = "Pending",
                  EnumId = WorkflowStatusEnum.ChildPending,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Child,
                  Description = "Deactivated",
                  EnumId = WorkflowStatusEnum.ChildDeactivated,
                },
                new T
                {
                  WorkflowStatusTypeId = WorkflowStatusTypeSeedConstants.Child,
                  Description = "External Link",
                  EnumId = WorkflowStatusEnum.ChildExternalLink,
                },
            };
        }
    }
}
