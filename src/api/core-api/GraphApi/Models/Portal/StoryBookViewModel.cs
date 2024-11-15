using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class StoryBookViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Themes { get; set; }
        public Guid LocaleId { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime? InsertedDate { get; set; }
        public Guid[] AvailableLanguages { get; set; }

        public StoryBookViewModel(Object record, Guid localeId) {

            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("updatedDate", out var updatedDate);
            item.TryGetValue("insertedDate", out var insertedDate);
            item.TryGetValue("availableLanguages", out var availableLanguages);

            Id = id.ToString();
            Name = name.ToString();
            LocaleId = localeId;
            Themes = "";
            UpdatedDate = DateTime.Parse(updatedDate.ToString());
            InsertedDate = insertedDate != null ? DateTime.Parse(insertedDate.ToString()) : null;
            AvailableLanguages = (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToArray();
        }
    }

    public class ThemeViewModel
    {
        public string Name { get; set; }
        public string StoryBookId { get; set; }

        public ThemeViewModel(string themeName, Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("storyBook", out var storyBook);

            Name = themeName;
            StoryBookId = storyBook.ToString();
        }
    }
}
