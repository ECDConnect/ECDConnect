namespace ECDLink.Core.Models.Settings
{
    public interface ISetting
    {
        public string Grouping { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public bool? IsSystemValue { get; set; }
    }
}
