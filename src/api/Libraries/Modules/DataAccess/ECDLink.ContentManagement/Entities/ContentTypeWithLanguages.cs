using ECDLink.DataAccessLayer.Entities;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Entities
{
    public class ContentTypeWithLanguages : ContentType
    {
        public ContentTypeWithLanguages(ContentType ct)
        {
            Id = ct.Id;
            Name = ct.Name;
            Description = ct.Description;
            Fields = ct.Fields;
            Content = ct.Content;
            MetaData = ct.MetaData;
            IsActive = ct.IsActive;
            IsVisiblePortal = ct.IsVisiblePortal;
            PortalDisplayOrder = ct.PortalDisplayOrder;
            InsertedDate = ct.InsertedDate;
            TenantId = ct.TenantId;
            UpdatedDate = ct.UpdatedDate;
            UpdatedBy = ct.UpdatedBy;
            Languages = new List<Language>();
        }

        public ContentTypeWithLanguages() : base() { }

        public IList<Language> Languages { get; set; } = null;
        
    }
}
