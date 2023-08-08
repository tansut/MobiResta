using Maiter.Shared.ViewModels.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Company
{
    [TsEnum]
    public enum ServiceKind
    {
        Default=0,
        Other = 1,
        Customer = 2,
        Worker = 4,
        CRM = 8,
        Waiter = 16,
        Vale = 32,

    }

    [TsClass]
    public class ServiceInfo
    {
        public GlobalContent<string> Title { get; set; }
    }

    [TsClass]
    public static class ServiceDefaults
    {
        public static Dictionary<ServiceKind, ServiceInfo> Values = new Dictionary<ServiceKind, ServiceInfo>();

        static ServiceDefaults()
        {

            var crm = Values[ServiceKind.CRM] = new ServiceInfo()
            {
                Title = new GlobalContent<string>()
            };

            crm.Title.Values["en"] = "Customer Relations";
            crm.Title.Values["tr"] = "Müşteri Hizmetleri";

            var waiter = Values[ServiceKind.Waiter] = new ServiceInfo()
            {
                Title = new GlobalContent<string>()
            };

            waiter.Title.Values["en"] = "Waiter";
            waiter.Title.Values["tr"] = "Servis Görevlisi";

            var vale = Values[ServiceKind.Vale] = new ServiceInfo()
            {
                Title = new GlobalContent<string>()
            };

            vale.Title.Values["en"] = "Vale";
            vale.Title.Values["tr"] = "Vale";

            var other = Values[ServiceKind.Other] = new ServiceInfo()
            {
                Title = new GlobalContent<string>()
            };

            other.Title.Values["en"] = "Other";
            other.Title.Values["tr"] = "Diğer";

        }
    }
}
