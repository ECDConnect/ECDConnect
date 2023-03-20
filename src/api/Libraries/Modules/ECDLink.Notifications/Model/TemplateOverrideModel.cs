namespace ECDLink.Notifications.Model
{
    public class TemplateOverrideModel : ITemplateOverrideModel
    {
        public string Value { get; set; }
    }

    public interface ITemplateOverrideModel
    {
        public string Value { get; set; }
    }
}
