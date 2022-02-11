using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace ECDLink.Core.Enums
{
    public enum ConsentTypeEnum
    {
        [Description("TermsAndConditions")]
        TermsAndConditions,
        [Description("DataPermissionsAgreement")]
        DataPermissionsAgreement,
        [Description("PersonalInformationAgreement")]
        PersonalInformationAgreement,
        [Description("ConsentAgreement")]
        ConsentAgreement,
        [Description("CommitmentAgreement")]
        CommitmentAgreement,
        [Description("IndemnityAgreement")]
        IndemnityAgreement,
        [Description("PhotoPermissions")]
        PhotoPermissions,
        [Description("LearningThroughPlay")]
        LearningThroughPlay
    }
}
