using System.ComponentModel.DataAnnotations;

namespace ECDLink.Abstractrions.Enums
{
    public enum MetricsIconEnum
    {
        [Display(Name = "none")]
        None,
        [Display(Name = "error")]
        Error,
        [Display(Name = "warning")]
        Warning,
        [Display(Name = "success")]
        Success
    }
}
