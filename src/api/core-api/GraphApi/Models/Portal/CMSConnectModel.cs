using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Portal
{
    public class CMSConnectModel
    {
        public int ContentTypeId { get; set; }
        public int ContentId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Hint { get; set; }
        public List<CMSConnectItemModel> Links { get; set; }
    }

    public class CMSConnectItemModel
    {
        public int ContentTypeId { get; set; }
        public int ContentId { get; set; }
        public string ButtonText { get; set; }
        public string Link { get; set; }
        public int LinkedConnect { get; set; }
    }

}
