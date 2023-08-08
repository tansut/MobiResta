using Maiter.Shared.Entity;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Maiter.Shared.Util
{
    public static class GlobalizationHelper
    {
        public static string GetLang(string culture = null)
        {
            if (culture == null)
                culture = Thread.CurrentThread.CurrentUICulture.Name;
            var parts = culture.Split('-');
            var result = parts.Length > 1 ? parts[0] : culture;
            return result.ToLowerInvariant();
        }

        public static List<Culture> ListCultures()
        {
            var result = new List<Culture>(200);
            foreach (CultureInfo info in CultureInfo.GetCultures(CultureTypes.NeutralCultures))
            {
                result.Add(new Culture()
                {
                    Code = info.Name,
                    CurrencySymbol = info.NumberFormat.CurrencySymbol,
                    NativeName = info.NativeName,
                    Name = info.EnglishName
                });
            }
            return result;
        }

        public static List<string> ListCurrency()
        {
            var result = new List<string>(200);
            foreach (CultureInfo info in CultureInfo.GetCultures(CultureTypes.NeutralCultures))
            {
                if (result.IndexOf(info.NumberFormat.CurrencySymbol) < 0)
                    result.Add(info.NumberFormat.CurrencySymbol);
            }
            return result;
        }
    }
}
