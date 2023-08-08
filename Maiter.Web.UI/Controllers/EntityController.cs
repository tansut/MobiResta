using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Maiter.Core.Extensions;
using Maiter.Core.Business;
using System.Reflection;
using Maiter.Core.Web;
using System.Web.Http;
using Maiter.Shared.Entity;
using Maiter.Core.Configuration;
using Maiter.Core.Infrastructor;

namespace Maiter.Web.Controllers
{
    public class EntityController : DataController
    {

        //[HttpGet("{name}/{id}")]
        public object Id(string name, string id)
        {
            var fn = "Maiter.Shared.Entity." + name.Capitalize() + ", Maiter.Shared";
            var type = Type.GetType(fn, true);
            var d1 = typeof(IEntityBusiness<>);
            Type[] typeArgs = { type };
            var makeme = d1.MakeGenericType(typeArgs);
            // var business = (IEntityBusinessBase<string>)ServicesConfiguration.GetService(makeme);
            //   return business.Id(id);
            return null;
        }
    }
}
