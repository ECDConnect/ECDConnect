namespace ECDLink.AutomatedJobs.Configuration
{
    public static class CronTags
    {
        //[min] [hour] [day of month] [month] [day of week]
        public const string EveryMinute = "* * * * *";

        public const string EveryFiveMinutes = "*/5 * * * *";
        public const string EveryTenMinutes = "*/10 * * * *";
        public const string EveryTwentyMinutesMondayToFriday = "*/20 * * * 1-5";

        public const string NineAmMondayToFriday = "0 9 * * 1-5";

        public const string FourPmEveryFriday = "0 16 * * 5";

        public const string NinePmEveryFriday = "0 21 * * 5";
        public const string NinePmEverySunday = "0 21 * * 7";

        public const string MidnightDaily = "0 0 * * *";

        public const string EveryHour = "0 * * * *";
        public const string EveryTwoHours = "0 */2 * * *";
        public const string EighthOfEveryMonth = "0 0 8 * *";
        public const string FirstOfEveryMonth = "0 0 1 * *";
        public const string FirstDayofEveryYear = "0 0 1 1 *";

        public const string EighthOfEveryMonthNoon = "0 12 8 * *";
        public const string EndOfJuly = "0 0 31 7 *";
        public const string EndOfNovember = "0 0 30 11 *";
    }
}
