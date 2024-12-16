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

        public ThemeViewModel(Object record, Guid localeId) {

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
}
