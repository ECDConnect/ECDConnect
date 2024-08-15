using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalNatalModel
    {
        public PortalNatalModel()
        {
        }

        public PortalNatalModel(string title, string section, List<string> availableLanguages, string childType, string childId, 
                                DateTime updatedDate, string childContentTypeName, string childContentTypeId)
        {
            Title = title;
            Section = section;
            AvailableLanguages = availableLanguages;
            ChildType = childType;
            ChildId = childId;
            UpdatedDate = updatedDate;
            ChildContentTypeName = childContentTypeName;
            ChildContentTypeId = childContentTypeId;
        }
        public string Title { get; set; }
        public string Section { get; set; }
        public List<string> AvailableLanguages { get; set; }
        public string ChildType { get; set; }
        public string ChildId { get; set; }
        public string ChildContentTypeName { get; set; }
        public string ChildContentTypeId { get; set; }
        public DateTime UpdatedDate { get; set; }

    }
}
