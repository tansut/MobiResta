using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Messaging
{
    public static class MessageFactory
    {
        private static Dictionary<string, Type> Types = new Dictionary<string, Type>();


        static MessageFactory()
        {
            Register(CustomerRequestMessage.TYPE, typeof(CustomerRequestMessage));
            Register(StatusMessage.TYPE, typeof(StatusMessage));
            Register(ReadMessage.TYPE, typeof(ReadMessage));
            Register(SentMessage.TYPE, typeof(SentMessage));
        }

        public static void Register(string name, Type t)
        {
            Types.Add(name, t);
        }

        public static Type Get(string name)
        {
            return Types[name];
        }
    }
}
