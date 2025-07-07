using System;
using System.Collections.Generic;

namespace ECDLink.ContentManagement.Models
{
    public class ContentTypeImportItem
    {
        public string TempId { get; set; }
        public List<ContentTypeImportSubItem> Translations { get; set; }
    }

    public class ContentTypeImportSubItem
    {
        public string Locale { get; set; }
        public List<ContentValueTemp> ContentValues { get; set; }
    }

    public class ContentValueTemp
    {
        public Guid LocaleId { get; set; }
        public int ContentTypeFieldId { get; set; }
        public string Value { get; set; }
    }
}
