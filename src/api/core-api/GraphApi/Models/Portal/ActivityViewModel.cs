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
        public string Image { get; set; }
        public string ShareContent { get; set; }
        public Guid LocaleId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? InsertedDate { get; set; }
        public List<Guid> AvailableLanguages { get; set; }
        public List<string> SubTypeItems { get; set; }
        public List<SubCategoryViewModel> SubCategoryItems { get; set; }
        public List<int> ThemeItems { get; set; }
        public bool IsInUse { get; set; }
        public string InUseThemeNames { get; set; }

        public ActivityViewModel(Object record, Guid localeId,
                                List<SubCategoryViewModel> subCategoriesItems,
                                List<ThemeDayViewModel> themeDayRecords,
                                List<ThemeNameDaysViewModel> themeRecords)
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
            item.TryGetValue("image", out var image);

            // activities are linked to theme days and theme days are linked to themes
            var linkedThemeDays = themeDayRecords
                    .Where(x => x.ActivityId == id.ToString())
                    .Select(x => x.ContentId)
                    .Distinct()
                    .ToList();

            var linkedThemes = string.Join(", ",
                themeRecords
                    .Where(x => x.ThemeDays.Intersect(linkedThemeDays).Any())
                    .Select(x => x.Name)
                    .Distinct()
                ); 

            Id = id.ToString();
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
            UpdatedDate = updatedDate != null ? DateTime.Parse(updatedDate.ToString()) : null;
            InsertedDate = insertedDate != null ? DateTime.Parse(insertedDate.ToString()) : null;
            AvailableLanguages = availableLanguages != null ? (availableLanguages as string).Split(",").Select(i => new Guid(i)).ToList() : new List<Guid>();
            SubTypeItems = subType != null ? subType.ToString().Split(",").Where(word => word != "").Select(word => char.ToUpper(word.Trim()[0]) + word.Trim().Substring(1)).OrderByDescending(x => x).Distinct().ToList() : new List<string>();
             InUseThemeNames = linkedThemes;
            IsInUse = linkedThemes.Count() != 0;
            
            var subCats = subCategories != null ? subCategories.ToString().Split(",").ToList() : new List<string>();
            SubCategoryItems = subCategoriesItems.Where(x => subCats.Contains(x.Id)).ToList();
            ThemeItems = themes != null ? themes.ToString().Split(",").Where(x => x != "").Select(x => Int32.Parse(x)).ToList() : new List<int>();

            
        }
    }

    public class SubCategoryViewModel 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string ImageHexColor { get; set; }

        public SubCategoryViewModel(Object record) {
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
