using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Maiter.Core.Web
{
    public class ClientDictionary : Dictionary<string, object>
    {

        public T? GetNullableValue<T>(string key, T? def = null) where T : struct
        {
            object val;
            var isEnum = typeof(T).IsEnum;
            if (!isEnum)
            {
                if (this.TryGetValue(key, out val))
                {
                    return val as T?;
                }
                else return def.HasValue ? def.Value : def;
            }
            else
            {
                string stringValue = null;
                if (this.TryGetValue(key, out val))
                {
                    stringValue = val != null ? val.ToString() : null;
                }
                else stringValue = def.HasValue ? def.Value.ToString() : null;
                if (string.IsNullOrEmpty(stringValue))
                    return null;
                else
                {
                    T parsed;
                    if (Enum.TryParse<T>(stringValue, out parsed))
                        return parsed;
                    else return null;
                }
            }
        }

        public T GetValue<T>(string key, T? def = null) where T : struct
        {
            var val = GetNullableValue<T>(key, def.Value);
            return val.HasValue ? val.Value: default(T);
        }

        public T Get<T>(string key, T def = null) where T : class
        {
            object val;
            if (this.TryGetValue(key, out val))
            {
                return val as T;
            }
            else return def;
        }
    }
}
