using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalNatalModel
    {
        public PortalNatalModel()
        {
        }

        public PortalNatalModel(string title, string section, string languages, string type, DateTime lastUpdated)
        {
            Title = title;
            Section = section;
            Languages = languages;
            Type = type;
            LastUpdated = lastUpdated;
        }
        public string Title { get; set; }
        public string Section { get; set; }
        public string Languages { get; set; }
        public string Type { get; set; }
        public DateTime LastUpdated { get; set; }

    }
}
