using Maiter.Shared.ViewModels.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{

    [TsClass]
    public class CallRequest : RequestContent
    {
        public const string RequestType = CallRequestType.Name;        
    }
}
