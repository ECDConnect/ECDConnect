namespace ECDLink.DataAccessLayer.Entities
{  
    public class ResultReturnObject
    {
        public bool Result { get; set; } = true;
        public string ResultMessage { get; set; } = "";
        public string ResultObject { get; set; } = null;

    }
}
