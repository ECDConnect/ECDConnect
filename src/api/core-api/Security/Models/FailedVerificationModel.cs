namespace EcdLink.Api.CoreApi.Security.Models
{
    public class FailedVerificationModel
    {
        public string Error { get; set; }
        public int ErrorCode { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
    }
}
