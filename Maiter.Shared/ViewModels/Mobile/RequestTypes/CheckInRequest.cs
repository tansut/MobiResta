using Maiter.Shared.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsClass]
    public class CheckInRequest : RequestContent
    {
        public const string RequestType = "checkIn";
        public TagContent Tag { get; set; }
    }



}
