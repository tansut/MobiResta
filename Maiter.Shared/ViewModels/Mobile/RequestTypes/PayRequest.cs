using Maiter.Shared.ViewModels.Company;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsEnum]
    public enum PaymentType
    {
        CreditCard,
        Cash,
        Other
    }

    [TsClass]
    public class PayRequest : RequestContent
    {
        public const string RequestType = PayRequestType.Name;
        
        public string Payment { get; set; }        
    }
}
