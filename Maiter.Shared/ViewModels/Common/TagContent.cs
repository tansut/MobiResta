using Maiter.Shared.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Common
{
    public enum TagType
    {
        Offline = 0,        
        Restaurant = 1,
        Table = 2
    }

    [TsClass]
    public class TagContent
    {
        public const string TAGDOMAIN = "http://www.mobiresta.com/tag/";

        //[JsonProperty(PropertyName ="t")]
        public TagType Type { get; set; }
        //[JsonProperty(PropertyName = "v")]
        public string Version { get; set; }
        //public string Zone { get; set; }
        //public long Time { get; set; }
        //[JsonProperty(PropertyName = "i")]
        public string Id { get; set; }
        //public string Owner { get; set; }
        //[JsonProperty(PropertyName = "s")]
        public string Sign { get; set; }

        private static string SecureKey = IdGenerator.GeneratorName;



        public TagContent()
        {

        }

        public static TagContent Create(TagType type, string version)
        {
            return new TagContent()
            {
                Type = type,
                //Zone = TimeZoneInfo.Local.Id,
                //Time = DateTime.UtcNow.Ticks,
                Version = version
            };
        }

        private string GetContent(bool withSign = false)
        {
            return withSign ? string.Format("{0}{1}{2}{3}", this.Type, this.Version, this.Id, this.Sign) : string.Format("{0}{1}{2}", this.Type, this.Version, this.Id);
        }

        public string ComputeSign()
        {
            var content = this.GetContent();
            var digest = Cryptography.GetHash(content);
            return Cryptography.Encrypt(digest, SecureKey);
        }


        public string Serialize()
        {
            this.Sign = this.ComputeSign();
            var bytes = System.Text.Encoding.UTF8.GetBytes(Newtonsoft.Json.JsonConvert.SerializeObject(this, Formatting.None));
            return string.Format(Convert.ToBase64String(bytes));
        }

        public static TagContent From(string serialized)
        {
            var bytes = Convert.FromBase64String(serialized);
            var content = System.Text.Encoding.UTF8.GetString(bytes);
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<TagContent>(content);
            return result.VerifySign() ? result : null;
        }

        public bool VerifySign()
        {
            var computed = this.ComputeSign();
            if (this.Sign != computed)
                return false;
            else return true;
        }
    }
}
