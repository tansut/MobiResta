using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsClass]
    class CheckInRequestType : RequestType
    {
        public const string Name = "checkIn";

        public CheckInRequestType() : base(Name)
        {

        }
    }

    [TsClass]
    public class CustomRequestType : RequestType
    {
        public const string Name = "custom";

        public CustomRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Send Message";
            this.Title.Values["tr"] = "Mesaj İlet";
            Icon = "ion-chatboxes";
        }
    }

    [TsClass]
    public class ChatRequestType : RequestType
    {
        public const string Name = "chat";

        public ChatRequestType() : base(Name)
        {
            this.Title.Values["en"] = "Send Message";
            this.Title.Values["tr"] = "Mesaj İlet";
        }
    }
}
