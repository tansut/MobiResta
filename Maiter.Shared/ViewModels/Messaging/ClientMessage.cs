using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Messaging
{
    [TsClass]
    public class ClientMessageBase
    {
        public string MessageType { get; set; }

        [TsIgnore]
        public MessageBase MessageContent { get; set; }

    }

    [TsClass]
    public class ClientMessage<T> : ClientMessageBase where T : MessageBase
    {
        public new T MessageContent { get; set; }
    }
}
