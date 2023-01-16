using System.ComponentModel.DataAnnotations;

namespace ECDLink.Abstractrions.Enums
{
    public enum MetricsColorEnum
    {
        [Display(Name = "white")]
        None,
        [Display(Name = "red")]
        Error,
        [Display(Name = "orange")]
        Warning,
        [Display(Name = "green")]
        Success
    }
}
