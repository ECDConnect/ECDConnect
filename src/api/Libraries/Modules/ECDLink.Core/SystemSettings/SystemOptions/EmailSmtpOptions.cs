using ECDLink.Core.Attributes;

namespace ECDLink.Core.SystemSettings.SystemOptions
{
    [SettingGroup(SettingGroups.Notifications.Email.Smtp.SmtpGrouping)]
    public class EmailSmtpOptions
    {
        /// <summary>
        /// Username for authenticating with Smtp server
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Password for authenticating with smtp server
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Default "from" email address used to send messages from. (Address of sender)
        /// </summary>
        public string FromEmail { get; set; }

        /// <summary>
        /// Display name to use for DefaultEmail. (Name of sender)
        /// </summary>
        public string FromEmailDisplayName { get; set; }

        /// <summary>
        /// Url for Smtp service used to send message
        /// </summary>
        public string SmtpServerAddress { get; set; }

        /// <summary>
        /// Port for SmtpServerAddress connection
        /// </summary>
        public int SmtpServerPort { get; set; } = 587;

        /// <summary>
        /// Use a TLS connection to send message?
        /// </summary>
        public bool SmtpServerUseTLS { get; set; } = true;

        /// <summary>
        /// Secondarty Url for Smtp service if SmtpServerAddress connection fails
        /// </summary>
        public string SmtpServerSecondaryAddress { get; set; }

        /// <summary>
        /// Port for SmtpServerSecondaryAddress connection
        /// </summary>
        public int SmtpServerSecondaryPort { get; set; } = 587;

        /// <summary>
        /// Use a TLS connection to send message when using secondary server?
        /// </summary>
        public bool SmtpServerSecondaryUseTLS { get; set; } = true;

        /// <summary>
        /// Number of times to retry sending if error occurs.
        /// </summary>
        public int RetryCount { get; set; } = 0;

        /// <summary>
        /// Time to wait between retries
        /// </summary>
        public int RetryWaitMiliseconds { get; set; } = 300;

        /// <summary>
        /// Disable SMTP email sending
        /// </summary>
        public bool Disabled { get; set; } = false;

        /// <summary>
        /// Disable SMTP email sending
        /// </summary>
        public string DevOverrideEmailAddress { get; set; } = "";
    }
}
