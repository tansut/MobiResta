using Maiter.Shared.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Shared.ViewModels.Common
{
    public class GlobalContent<T> where T : class
    {
        [JsonIgnore]
        public Dictionary<string, T> Values { get; set; }

        public T Value
        {
            get
            {
                var lang = GlobalizationHelper.GetLang();
                T result = null;
                if (Values.TryGetValue(lang, out result))
                    return result;
                else return Values.Keys.Any() ? Values.FirstOrDefault().Value: null;
            }
        }

        public GlobalContent()
        {
            this.Values = new Dictionary<string, T>();
        }
    }
}
