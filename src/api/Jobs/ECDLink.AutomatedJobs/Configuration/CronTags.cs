namespace ECDLink.AutomatedJobs.Configuration
{
    public static class CronTags
    {
        public const string EveryMinute = "0 * * * * *";

        public const string EveryFiveMinutes = "0 */5 * * * *";
        public const string EveryTenMinutes = "0 */10 * * * *";
        public const string EveryTwentyMinutes = "0 */20 * * * *";

        public const string NineAmWeekDaily = "0 0 9 * * 1-5";

        public const string FourPmEveryFriday = "0 0 16 * * 5";

        public const string NinePmEveryFriday = "0 0 21 * * 5";

        public const string MidnightDaily = "0 0 0 * * *";

        public const string EveryTwoHours = "0 * */2 * * *";
    }
}
