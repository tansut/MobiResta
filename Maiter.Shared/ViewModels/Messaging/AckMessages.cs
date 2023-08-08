using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Messaging
{
    [TsClass]
    class ReadMessage: MessageBase
    {
        public const string TYPE = "ReadMessage";
        public string[] AdditionalIds { get; set; }
    }


    [TsClass]
    class SentMessage : MessageBase
    {
        public const string TYPE = "SentMessage";
        public string[] AdditionalIds { get; set; }
    }

}
