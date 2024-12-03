using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class ActivityViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Materials { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public string SubCategories { get; set; }
        public string Themes { get; set; }
        public string ShareContent { get; set; }
        public Guid LocaleId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? InsertedDate { get; set; }
        public List<Guid> AvailableLanguages { get; set; }


        public ActivityViewModel(Object record, Guid localeId)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("materials", out var materials);
            item.TryGetValue("description", out var description);
            item.TryGetValue("notes", out var notes);
            item.TryGetValue("subType", out var subType);
            item.TryGetValue("type", out var type);
            item.TryGetValue("subCategories", out var subCategories);
            item.TryGetValue("themes", out var themes);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("updatedDate", out var updatedDate);
            item.TryGetValue("insertedDate", out var insertedDate);
            item.TryGetValue("availableLanguages", out var availableLanguages);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Materials = materials != null ? materials.ToString() : "";
            Description = description != null ? description.ToString() : "";
            Notes = notes != null ? notes.ToString() : "";
            SubType = subType != null ? subType.ToString() : "";
            Type = type != null ? type.ToString() : "";
            SubCategories = subCategories != null ? subCategories.ToString() : "";
            LocaleId = localeId;
            Themes = themes != null ? themes.ToString() : "";
            ShareContent = shareContent == null ? "" : shareContent.ToString();
            UpdatedDate = updatedDate != null ? DateTime.Parse(updatedDate.ToString()) : null;
            InsertedDate = insertedDate != null ? DateTime.Parse(insertedDate.ToString()) : null;
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
        }
    }
}
