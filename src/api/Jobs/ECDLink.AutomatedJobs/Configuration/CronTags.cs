namespace ECDLink.AutomatedJobs.Configuration
{
    public static class CronTags
    {
        //[0] [min] [hour] [day of month] [month] [day of week]
        public const string EveryMinute = "0 * * * * *";

        public const string EveryFiveMinutes = "0 */5 * * * *";
        public const string EveryTenMinutes = "0 */10 * * * *";
        public const string EveryTwentyMinutes = "0 */20 * * * 1-5";

        public const string NineAmWeekDaily = "0 0 9 * * 1-5";

        public const string FourPmEveryFriday = "0 0 16 * * 5";

        public const string NinePmEveryFriday = "0 0 21 * * 5";
        public const string NinePmEverySunday = "0 0 21 * * 7";

        public const string MidnightDaily = "0 0 0 * * *";

        public const string EveryTwoHours = "0 * */2 * * *";
        public const string EighthOfEveryMonth = "0 0 0 8 * *";
        public const string FirstOfEveryMonth = "0 0 * 1 * *";
        public const string FirstDayofEveryYear = "0 0 0 1 1 *";
    }
}
