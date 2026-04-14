using System.ComponentModel;

public enum NonSubsidyRegistrationType
{
    [Description("Yes - fully registered")]
    FullyRegistered,
    [Description("Yes - partially registered")]
    PartiallyRegistered,    
    [Description("No - I started the process of registering")]
    StartedRegistration,
    [Description("No - I have not started the process of registering")]
    NotStartedRegistration,
    [Description("I'm not sure")]
    NotSure
}