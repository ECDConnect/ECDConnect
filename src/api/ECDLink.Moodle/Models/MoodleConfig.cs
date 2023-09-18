namespace ECDLink.Moodle.Models
{
    public class MoodleConfig
    {
        public class UserTypeConfig
        {
            public string UserType { get; set; }
            public string[] Cohorts { get; set; }
        }

        public class DatabaseConfig
        {
            public string Type { get; set; }
            public string ConnectionString { get; set; }
        }

        public class SiteConfig
        {
            public string Address { get; set; }
            public string DefaultPassword { get; set; }
            public string UserNameFormatString { get; set; }
            public string EmailFormatString { get; set; }
        }

        public UserTypeConfig[] UserTypes { get; set; }
        public DatabaseConfig Database { get; set; }
        public SiteConfig Site { get; set; }
    }
}
