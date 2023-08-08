using Maiter.Shared.Entity;
using Maiter.Shared.Util;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Maiter.Web.UI.Controllers
{
    public class MetaController: Core.Web.ApiBase
    {
        [HttpGet]
        public List<Culture> ListCultures()
        {
            var list = GlobalizationHelper.ListCultures();
            list.RemoveAt(0);
            return list;
        }

        [HttpGet]
        public List<string> ListCurrency()
        {
            return GlobalizationHelper.ListCurrency();
        }

        [HttpGet]
        public Dictionary<string, string> ListTimezones()
        {
            var result = new Dictionary<string, string>();
            foreach (TimeZoneInfo z in TimeZoneInfo.GetSystemTimeZones())
                result[z.Id] = z.DisplayName;

            return result;
        }
    }
}