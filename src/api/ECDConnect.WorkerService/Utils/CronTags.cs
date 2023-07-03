namespace ECDConnect.WorkerService.Utils
{
    public static class CronTags
    {
        public const string EveryMinute = "0 * * * * *";

        public const string EveryFiveMinutes = "0 */5 * * * *";

        public const string NineAmWeekDaily = "0 0 9 * * 1-5";

        public const string FourPmEveryFriday = "0 0 16 * * 5";

        public const string MidnightDaily = "0 0 0 * * *";

        public const string EveryTwoHours = "0 * */2 * * *";
    }
}
