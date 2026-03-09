using System;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class ThemeDayModel
    {
        public string Name { get; set; }
        public string Day { get; set; }
        public string SmallGroupActivity { get; set; }
        public string LargeGroupActivity { get; set; }
        public string StoryBook { get; set; }
        public string StoryActivity { get; set; }
        public string TenantId { get; set; }
        public string ContentId { get; set; }


        public ThemeDayModel(Object record)
        {
            var item = (IDictionary<string, object>)record;

            item.TryGetValue("name", out var name);
            item.TryGetValue("day", out var day);
            item.TryGetValue("smallGroupActivity", out var smallGroupActivity);
            item.TryGetValue("largeGroupActivity", out var largeGroupActivity);
            item.TryGetValue("storyBook", out var storyBook);
            item.TryGetValue("storyActivity", out var storyActivity);
            item.TryGetValue("tenantId", out var tenantId);
            item.TryGetValue("id", out var id);

            Name = name != null ? name.ToString() : "";
            Day = day != null ? day.ToString() : "";
            SmallGroupActivity = smallGroupActivity != null ? smallGroupActivity.ToString() : "";
            LargeGroupActivity = largeGroupActivity != null ? largeGroupActivity.ToString() : "";
            StoryBook = storyBook != null ? storyBook.ToString() : "";
            StoryActivity = storyActivity != null ? storyActivity.ToString() : "";
            TenantId = tenantId != null ? tenantId.ToString() : "";
            ContentId = id != null ? id.ToString() : "";
        }
    }
}
