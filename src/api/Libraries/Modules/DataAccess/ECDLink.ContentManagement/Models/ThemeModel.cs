using System;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class ThemeModel
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public string ImageUrl { get; set; }
        public string ThemeDays { get; set; }
        public string ShareContent { get; set; }
        public string ThemeLogo { get; set; }
        public string DefaultName { get; set; }


        public ThemeModel(Object record, string defaultName)
        {
            var item = (IDictionary<string, object>)record;

            item.TryGetValue("name", out var name);
            item.TryGetValue("color", out var color);
            item.TryGetValue("imageUrl", out var imageUrl);
            item.TryGetValue("shareContent", out var shareContent);
            item.TryGetValue("themeLogo", out var themeLogo);


            Name = name != null ? name.ToString() : "";
            Color = color != null ? color.ToString() : "";
            ImageUrl = imageUrl != null ? imageUrl.ToString() : "";
            ThemeDays = "";
            ShareContent = shareContent != null ? shareContent.ToString() : "";
            ThemeLogo = themeLogo != null ? themeLogo.ToString() : "";
            DefaultName = defaultName;
        }
    }
}
