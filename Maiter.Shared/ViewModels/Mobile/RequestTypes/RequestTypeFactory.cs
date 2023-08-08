using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    public static class RequestTypeFactory
    {
        private static Dictionary<string, Type> Types = new Dictionary<string, Type>();

        static List<RequestType> customerRequests = new List<RequestType>();

        static void initDefaults()
        {
            /* WAITER */
            var callWaiter = new CallRequestType();
            callWaiter.DisplayOrder = 100;

            var payWaiter = new PayRequestType();
            payWaiter.DisplayOrder = 101;

            var customWaiter = new CustomRequestType();
            customWaiter.DisplayOrder = 103;
            customWaiter.TargetService = ServiceKind.Waiter;

            customWaiter.Title.Values["en"] = "Send Request";
            customWaiter.Title.Values["tr"] = "Talep İletin";

            customWaiter.Group = ServiceDefaults.Values[ServiceKind.Waiter].Title;

            var happyWaiter = new HapplyFeedbackRequestType();
            happyWaiter.DisplayOrder = 103;
            happyWaiter.TargetService = ServiceKind.Waiter;
            happyWaiter.Group = ServiceDefaults.Values[ServiceKind.Waiter].Title;

            var sadWaiter = new SadFeedbackRequestType();
            sadWaiter.DisplayOrder = 104;
            sadWaiter.TargetService = ServiceKind.Waiter;
            sadWaiter.Group = ServiceDefaults.Values[ServiceKind.Waiter].Title;

            customerRequests.AddRange(new RequestType[] { callWaiter, payWaiter, customWaiter, happyWaiter, sadWaiter });

            /*  VALE */
            var carRequest = new PrepareCarRequestType();
            carRequest.DisplayOrder = 100;

            var taxiRequest = new TaxiRequestType();
            taxiRequest.DisplayOrder = 101;

            var customVale = new CustomRequestType();
            customVale.DisplayOrder = 102;
            customVale.TargetService = ServiceKind.Vale;

            customVale.Title.Values["en"] = "Send Request";
            customVale.Title.Values["tr"] = "Talep İletin";

            customVale.Group = ServiceDefaults.Values[ServiceKind.Vale].Title;

            customerRequests.AddRange(new RequestType[] { carRequest, taxiRequest, customVale });

            /* CRM */
            var crmFeedback = new FeedbackRequestType();
            crmFeedback.DisplayOrder = 300;
            crmFeedback.Title.Values["en"] = "Contact";
            crmFeedback.Title.Values["tr"] = "İletişime Geçin";
            crmFeedback.TargetService = ServiceKind.CRM;
            crmFeedback.Group = ServiceDefaults.Values[ServiceKind.CRM].Title;
            customerRequests.AddRange(new RequestType[] { crmFeedback });

            var chat = new ChatRequestType();
            chat.DisplayOrder = -1;
            customerRequests.AddRange(new RequestType[] { chat });
        }

        static RequestTypeFactory()
        {
            // waiter
            //RequestFactory.Register(CallRequestType.Name, typeof(CallRequestType));
            //RequestFactory.Register(PayRequestType.Name, typeof(PayRequestType));

            ////vale
            //RequestFactory.Register(PrepareCarRequestType.Name, typeof(PrepareCarRequestType));
            //RequestFactory.Register(TaxiRequestType.Name, typeof(TaxiRequestType));
            //RequestFactory.Register(CustomValeRequestType.Name, typeof(CustomValeRequestType));

            ////CRM
            //RequestFactory.Register(CRMHappyFeedbackType.Name, typeof(CRMHappyFeedbackType));
            ////RequestFactory.Register(CRMSadFeedbackType.Name, typeof(CRMSadFeedbackType));
            ////RequestFactory.Register(CustomCRMRequestType.Name, typeof(CustomCRMRequestType));

            initDefaults();
        }

        public static void Register(string name, Type t)
        {
            Types.Add(name, t);
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

        public static List<RequestType> AllCustomerRequests()
        {
            return customerRequests;
        }
    }
}
