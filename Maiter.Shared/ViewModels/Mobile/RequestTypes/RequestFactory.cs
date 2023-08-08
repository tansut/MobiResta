using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    public static class RequestFactory
    {
        private static Dictionary<string, Type> Types = new Dictionary<string, Type>();


        static RequestFactory()
        {
            Register(PayRequest.RequestType, typeof(PayRequest));
            Register(CheckInRequest.RequestType, typeof(CheckInRequest));
            Register(CustomRequest.RequestType, typeof(CustomRequest));
            Register(ChatRequest.RequestType, typeof(ChatRequest));
        }

        public static void Register(string name, Type t)
        {
            Types.Add(name, t);
        }

        public static Type Get(string name)
        {
            return Types[name];
        }


        static CustomerRequestType CreateCustomer(string name)
        {
            var type = Types[name];
            return Activator.CreateInstance(type, new object[] { }) as CustomerRequestType;
        }

        static WorkerRequestType CreateWorker(string name)
        {
            var type = Types[name];
            return Activator.CreateInstance(type, new object[] { }) as WorkerRequestType;
        }
    }
}
