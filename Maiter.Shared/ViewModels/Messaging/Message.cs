using Maiter.Shared.ViewModels.Company;
using Maiter.Shared.ViewModels.Mobile.RequestTypes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Messaging
{
    [TsEnum]
    public enum MessageState
    {
        Created = 1,
        Transferred = 2,
        Sent = 4,
        Read = 8,
        Received = 16,
        Replied = 32
    }

    [TsClass]
    public class MessageBase
    {
        public string Id { get; set; }
        public string ToUserId { get; set; }
        public string FromUserId { get; set; }
        public ServiceKind FromService { get; set; }
        public ServiceKind ToService { get; set; }


        [JsonIgnore]
        public MessageState State { get; set; }

        public DateTime CreatedAt { get; set; }

        public MessageBase()
        {
            FromService = ServiceKind.Other;
            ToService = ServiceKind.Other;
            State = Messaging.MessageState.Created;
            CreatedAt = DateTime.UtcNow;
        }
    }

    [TsClass]
    public class ChatMessage : MessageBase
    {
        public const string TYPE = "ChatMessage";
        public string ToUserName { get; set; }
        public string UserContent { get; set; }
        public string FromUserName { get; set; }
    }

    [TsClass]
    public class StatusMessage : MessageBase
    {
        public const string TYPE = "StatusMessage";
        public bool Online { get; set; }
    }

    [TsClass]
    public class RequestMessage : ChatMessage
    {
    }

    [TsClass]
    public class WorkerRequestMessage : RequestMessage
    {

    }

    [TsClass]
    public class CustomerRequestMessage : RequestMessage
    {
        public const string TYPE = "CustomerRequestMessage";
        public string RequestType { get; set; }
        public RequestContent RequestContent { get; set; }
    }

    [TsClass]
    public class RequestResponse 
    {
        public string Id { get; set; }
        public string ToUserId { get; set; }
        public string ToUserName { get; set; }
        public ServiceKind ToService { get; set; }
        public string MessageType { get; set; }
        public DateTime CreatedAt { get; set; }


        public static RequestResponse FromMessage(string messageType, RequestMessage msg)
        {
            return new RequestResponse()
            {
                Id = msg.Id,
                ToService = msg.ToService,
                ToUserId = msg.ToUserId,
                MessageType = messageType,
                CreatedAt = msg.CreatedAt,
                ToUserName = msg.ToUserName
            };
        }
    }
}
