using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.ViewModels.Account
{

    [TsClass(Module = "Kalitte")]
    public class FacebookAuthUserInfoResult
    {
        public string Email { get; set; }
        public string FacebookId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string ExternalKey { get; set; }
        public string ProvierKey { get; set; }
        public string Gender { get; set; }
        public string FacebookPage { get; set; }
        public string Locale { get; set; }
        public string Timezone { get; set; }
    }

}
