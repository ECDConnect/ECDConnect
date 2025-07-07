using ECDLink.ContentManagement.Entities.Base;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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
