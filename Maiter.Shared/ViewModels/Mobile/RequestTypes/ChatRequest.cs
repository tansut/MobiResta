using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsClass]
    public class ChatRequest : RequestContent
    {
        public const string RequestType = ChatRequestType.Name;
        public string ToUserId { get; set; }
    }
}
