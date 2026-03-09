using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.ContentManagement.Models
{
    public class ActivityModel
    {
        public string Name { get; set; }
        public string Materials { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public string SubCategories { get; set; }
        public string Themes { get; set; }
        public string Image { get; set; }
        public string ShareContent { get; set; }
        public Guid LocaleId { get; set; }
        public string ContentId { get; set; }
        public List<Guid> AvailableLanguages { get; set; }

        public ActivityModel(object record, Guid localeId)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("name", out var name);
            item.TryGetValue("materials", out var materials);
            item.TryGetValue("description", out var description);
            item.TryGetValue("notes", out var notes);
            item.TryGetValue("subType", out var subType);
            item.TryGetValue("type", out var type);
            item.TryGetValue("subCategories", out var subCategories);
            item.TryGetValue("themes", out var themes);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("image", out var image);
            item.TryGetValue("contentId", out var contentId);
            item.TryGetValue("availableLanguages", out var availableLanguages);

            Name = name != null ? name.ToString() : "";
            Materials = materials != null ? materials.ToString() : "";
            Description = description != null ? description.ToString() : "";
            Notes = notes != null ? notes.ToString() : "";
            SubType = subType != null ? subType.ToString() : "";
            SubCategories = subCategories != null ? subCategories.ToString() : "";
            Type = type != null ? type.ToString() : "";
            LocaleId = localeId;
            Themes = themes != null ? themes.ToString() : "";
            Image = image != null ? image.ToString() : "";
            ShareContent = shareContent == null ? "" : shareContent.ToString();
            ContentId = contentId != null ? contentId.ToString() : "";
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
        }
    }

    public class SubCategoryModel 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string ImageHexColor { get; set; }

        public SubCategoryModel(Object record) {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("imageUrl", out var imageUrl);
            item.TryGetValue("imageHexColor", out var imageHexColor);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            ImageUrl = imageUrl != null ? imageUrl.ToString() : "";
            ImageHexColor = imageHexColor != null ? imageHexColor.ToString(): "";
        }
    }
}
