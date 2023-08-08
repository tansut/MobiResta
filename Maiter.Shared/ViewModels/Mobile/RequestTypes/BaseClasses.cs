using Maiter.Shared.Data;
using Maiter.Shared.Entity;
using Maiter.Shared.ViewModels.Company;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Mobile.RequestTypes
{
    [TsClass]
    public class RequestContent
    {
    }


    [TsClass]
    public class RequestBagBase 
    {
        public string CheckInId { get; set; }
        public string CompanyId { get; set; }
        public string CompanySectionId { get; set; }
        public string TableId { get; set; }
        public string UserText { get; set; }
        public ServiceKind Target { get; set; }
        public ServiceKind Source { get; set; }
        public GeoPoint Location { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public ResTable Table { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public Entity.Company Company { get; set; }

        [TsIgnore]
        [JsonIgnore]
        public CompanySection CompanySection { get; set; }
    }


    [TsClass]
    public class RequestBag<T>: RequestBagBase where T: RequestContent
    {
        public T RequestContent { get; set; }
    }
}
