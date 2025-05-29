using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ThemeViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string ImageUrl { get; set; }
        public string ThemeLogo { get; set; }
        public string ShareContent { get; set; }
        public string ThemeDays { get; set; }
        public Guid LocaleId { get; set; }
        public string TenantId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? InsertedDate { get; set; }
        public List<Guid> AvailableLanguages { get; set; }

        public ThemeViewModel(Object record, Guid localeId)
        {

            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("color", out var color);
            item.TryGetValue("updatedDate", out var updatedDate);
            item.TryGetValue("insertedDate", out var insertedDate);
            item.TryGetValue("availableLanguages", out var availableLanguages);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("imageUrl", out var imageUrl);
            item.TryGetValue("themeDays", out var themeDays);
            item.TryGetValue("themeLogo", out var themeLogo);
            item.TryGetValue("tenantId", out var tenantId);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Color = color != null ? color.ToString() : "";
            ImageUrl = imageUrl != null ? imageUrl.ToString() : "";
            ThemeDays = themeDays != null ? themeDays.ToString() : "";
            ThemeLogo = themeLogo != null ? themeLogo.ToString() : "";
            LocaleId = localeId;
            TenantId = tenantId != null ? tenantId.ToString() : "";
            ShareContent = shareContent == null ? "" : shareContent.ToString();
            UpdatedDate = updatedDate != null ? DateTime.Parse(updatedDate.ToString()) : null;
            InsertedDate = insertedDate != null ? DateTime.Parse(insertedDate.ToString()) : null;
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
        }
    }

    public class ThemeNameDaysViewModel
    {
        public string Name { get; set; }
        public List<string> ThemeDays { get; set; }
        public string TenantId { get; set; }

        public ThemeNameDaysViewModel(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("name", out var name);
            item.TryGetValue("themeDays", out var themeDays);
            item.TryGetValue("tenantId", out var tenantId);

            Name = name != null ? name.ToString() : "";
            ThemeDays = themeDays != null ? themeDays.ToString().Split(",").ToList() : new List<string>();
            TenantId = tenantId != null ? tenantId.ToString() : "";
        }
    }

    public class GeneralThemeDaysViewModel
    {
        public string Id { get; set; }
        public string TenantId { get; set; }
        public string StoryBook { get; set; }
        public string StoryActivity { get; set; }
        public string SmallGroupActivity { get; set; }
        public string LargeGroupActivity { get; set; }

        public GeneralThemeDaysViewModel(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("tenantId", out var tenantId);
            item.TryGetValue("storyBook", out var storyBook);
            item.TryGetValue("storyActivity", out var storyActivity);
            item.TryGetValue("smallGroupActivity", out var smallGroupActivity);
            item.TryGetValue("largeGroupActivity", out var largeGroupActivity);

            Id = id != null ? id.ToString() : "";
            TenantId = tenantId != null ? tenantId.ToString() : "";
            StoryBook = storyBook != null ? storyBook.ToString() : "";
            StoryActivity = storyActivity != null ? storyActivity.ToString() : "";
            SmallGroupActivity = smallGroupActivity != null ? smallGroupActivity.ToString() : "";
            LargeGroupActivity = largeGroupActivity != null ? largeGroupActivity.ToString() : "";
        }
    }

     public class ThemeDayViewModel
    {
        public string ContentId { get; set; }
        public string ActivityId { get; set; }

        public ThemeDayViewModel(string contentId, string activityId)
        {

            ContentId = contentId;
            ActivityId = activityId;
        }
    }
}
