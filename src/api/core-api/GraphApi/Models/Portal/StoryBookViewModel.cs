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
        public string ShareContent { get; set; }
        public Guid LocaleId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? InsertedDate { get; set; }
        public List<Guid> AvailableLanguages { get; set; }

        public string Author { get; set; }
        public string Illustrator { get; set; }
        public string Translator { get; set; }
        public string BookLocation { get; set; }
        public string Keywords { get; set; }
        public string StoryBookParts { get; set; }

        public StoryBookViewModel(Object record, Guid localeId) {

            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("type", out var type);
            item.TryGetValue("updatedDate", out var updatedDate);
            item.TryGetValue("insertedDate", out var insertedDate);
            item.TryGetValue("availableLanguages", out var availableLanguages);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("author", out var author);
            item.TryGetValue("illustrator", out var illustrator);
            item.TryGetValue("translator", out var translator);
            item.TryGetValue("bookLocation", out var bookLocation);
            item.TryGetValue("keywords", out var keywords);
            item.TryGetValue("storyBookParts", out var storyBookParts);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Type = type != null ? type.ToString() : "";
            Author = author != null ? author.ToString() : "";
            Illustrator = illustrator != null ? illustrator.ToString() : "";
            Translator = translator != null ? translator.ToString() : "";
            BookLocation = bookLocation != null ? bookLocation.ToString() : "";
            Keywords = keywords != null ? keywords.ToString() : "";
            StoryBookParts = storyBookParts != null ? storyBookParts.ToString() : "";
            LocaleId = localeId;
            Themes = "";
            ShareContent = shareContent == null ? "" : shareContent.ToString();
            UpdatedDate = updatedDate != null ? DateTime.Parse(updatedDate.ToString()) : null;
            InsertedDate = insertedDate != null ? DateTime.Parse(insertedDate.ToString()) : null;
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
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
