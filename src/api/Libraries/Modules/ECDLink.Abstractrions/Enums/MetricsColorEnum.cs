using System.ComponentModel;

namespace ECDLink.Abstractrions.Enums
{
    public enum MetricsColorEnum
    {
        [Description("white")]
        None,
        [Description("red")]
        Error,
        [Description("orange")]
        Warning,
        [Description("green")]
        Success
    }
}
