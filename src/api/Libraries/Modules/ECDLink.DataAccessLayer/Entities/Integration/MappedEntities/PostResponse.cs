using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class PostResponse
    {
        public string Guid { get; set; }
        public int RequestIndex { get; set; }
        public int HttpStatusCode { get; set; }
        public string Message { get; set; }
        public SLException Exception { get; set; }

    }

    public class SLException
    {
        public int ErrorCode { get; set; }
        public string Message { get; set; }
        public DateTime DateTimeStamp { get; set; }

    }


}
