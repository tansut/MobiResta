using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Maiter.Core.Util
{
    public class Helper
    {
        public static string FullUrlForRequest(string url = "", HttpContext context = null)
        {
            if (context == null)
                context = HttpContext.Current;
            if (context == null || context.Request == null)
                return url;
            return context.Request.Url.AbsoluteUri.Replace(context.Request.Url.AbsolutePath, url);
        }

        public static List<FieldInfo> GetConstants(Type type)
        {
            FieldInfo[] fieldInfos = type.GetFields(BindingFlags.Public |
                 BindingFlags.Static | BindingFlags.FlattenHierarchy);

            return fieldInfos.Where(fi => fi.IsLiteral && !fi.IsInitOnly).ToList();
        }

        public static string GetHash(string input)
        {
            using (HashAlgorithm hashAlgorithm = new SHA256CryptoServiceProvider())
            {
                byte[] byteValue = Encoding.UTF8.GetBytes(input);

                byte[] byteHash = hashAlgorithm.ComputeHash(byteValue);

                return Convert.ToBase64String(byteHash);
            }
        }


        public static string GetBaseHttpUri()
        {
            Uri uri = HttpContext.Current.Request.Url;
            return uri.Scheme + "://" + uri.Authority + "/";
        }
    }
}
