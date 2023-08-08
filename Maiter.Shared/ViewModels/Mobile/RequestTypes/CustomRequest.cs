using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsClass]
    public class CustomRequest : RequestContent
    {
        public const string RequestType = CustomRequestType.Name;
    }
}
