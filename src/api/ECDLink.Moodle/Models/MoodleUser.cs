using ECDLink.Core.Models.Training;

namespace ECDLink.Moodle.Models
{
    public class MoodleUser : TrainingUser
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string IdNumber { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phone1 { get; set; }
        public int Confirmed { get { return 1; } }
        public int Mnethostid { get { return 1; } }
        public string Timezone { get { return "Africa/Johannesburg"; } }
        public string Country { get { return "ZA"; } }
    }
}