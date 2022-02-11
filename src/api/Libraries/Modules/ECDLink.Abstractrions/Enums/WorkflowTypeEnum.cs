using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Abstractrions.Enums
{
    public enum WorkflowStatusEnum
    {
        DocumentPendingUpload,
        DocumentPendingVerification,
        DocumentDeclared,
        DocumentVerified,
        ChildActive,
        ChildPending,
        ChildDeactivated, 
        ChildExternalLink
    }
}
