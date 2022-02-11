using System;

namespace ECDLink.EGraphQL.Registration
{
    public class DynamicContentReload
    {
        public EventHandler StructureUpdated;

        public void InvokeUpdate(EventArgs e)
        {
            if (StructureUpdated != null)
            {
                StructureUpdated(this, e);
            }
        }
    }
}
