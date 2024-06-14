namespace ECDLink.Security.Api.Constants
{
    public static class NotificationsConstants
    {
        public const int SUCCESS = 0;
        public const int FAILED_AUTHENTICATION = 1;
        public const int FAILED_CONNECTION = 2;
        public const int FAILED_INSUFFICIENT_CREDITS = 3;
        public const int FAILED_OPTED_OUT = 4;

        public const string ITOUCH_ERROR = "Error";
        public const string ITOUCH_ERROR_CODE_3 = "ErrorCode=3"; // failed auth
        public const string ITOUCH_ERROR_CODE_8 = "ErrorCode=8"; // insufficient funds

        public const string BULKSMS_AUTH = "Authentication Failed";
        public const string BULKSMS_CREDITS = "Insufficient Credits";
    }
}
