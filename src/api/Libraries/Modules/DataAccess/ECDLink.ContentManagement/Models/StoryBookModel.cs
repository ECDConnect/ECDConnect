using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.Models
{
    public class StoryBookModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Themes { get; set; }
        public string ShareContent { get; set; }
        public Guid LocaleId { get; set; }
        public List<Guid> AvailableLanguages { get; set; }

        public string Author { get; set; }
        public string AuthorsAuthorization { get; set; }
        public string Illustrator { get; set; }
        public string Translator { get; set; }
        public string BookLocation { get; set; }
        public string BookLocationLink { get; set; }
        public string Keywords { get; set; }
        public string StoryBookParts { get; set; }
        public string ContentId { get; set; }


        public StoryBookModel(Object record, Guid localeId)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("type", out var type);
            item.TryGetValue("themes", out var themes);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("availableLanguages", out var availableLanguages);
            item.TryGetValue("author", out var author);
            item.TryGetValue("authorsAuthorization", out var authorsAuthorization);
            item.TryGetValue("illustrator", out var illustrator);
            item.TryGetValue("translator", out var translator);
            item.TryGetValue("bookLocation", out var bookLocation);
            item.TryGetValue("bookLocationLink", out var bookLocationLink);
            item.TryGetValue("keywords", out var keywords);
            item.TryGetValue("storyBookParts", out var storyBookParts);
            
            item.TryGetValue("contentId", out var contentId);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Type = type != null ? type.ToString() : "";
            Author = author != null ? author.ToString() : "";
            AuthorsAuthorization = authorsAuthorization != null ? authorsAuthorization.ToString() : "";
            Illustrator = illustrator != null ? illustrator.ToString() : "";
            Translator = translator != null ? translator.ToString() : "";
            BookLocation = bookLocation != null ? bookLocation.ToString() : "";
            bookLocationLink = bookLocationLink != null ? bookLocationLink.ToString() : "";
            Keywords = keywords != null ? keywords.ToString() : "";
            StoryBookParts = storyBookParts != null ? storyBookParts.ToString() : "";
            LocaleId = localeId;
            Themes = themes != null ? themes.ToString() : "";
            ShareContent = shareContent == null ? "" : shareContent.ToString();
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
            ContentId = contentId != null ? contentId.ToString() : "";
        }
    }
}
