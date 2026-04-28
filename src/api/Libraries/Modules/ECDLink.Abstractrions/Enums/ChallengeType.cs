using System.ComponentModel;

public enum ChallengeType
{
    [Description("I don't know where to start")]
    DontKnowWhereToStart,

    [Description("The process takes too long or is too complicated")]
    ProcessTooLongOrComplicated,

    [Description("I don't understand what requirements or documents I need")]
    MissingRequirements,
    
    [Description("I don't have or cannot get the right documents")]
    MissingDocuments,

    [Description("I cannot reach the officials who can help")]
    UnreachableOfficials,

    [Description("I don't have the infrastructure or resources to meet requirements")]
    LackOfInfrastructureOrResources,

    [Description("Other")]
    Other = 99   
}