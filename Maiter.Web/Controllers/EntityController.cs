using Maiter.Web.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Maiter.Core.Extensions;
using Maiter.Core.Business;
using Microsoft.AspNet.Mvc;
using System.Reflection;

namespace Maiter.Web.Controllers
{
    public class EntityController : DataController
    {
        [HttpGet("{name}/{id}")]
        public object Id(string name, string id)
        {
            var fn = "Maiter.Shared.Entity." + name.Capitalize() + ", Maiter.Shared";
            var type = Type.GetType(fn, true);
            var d1 = typeof(EntityBusiness<>);
            Type[] typeArgs = { type };
            var makeme = d1.MakeGenericType(typeArgs);
            object business = Activator.CreateInstance(makeme);

            return business.GetType().GetMethod("Id").Invoke(business, new object[] { id });
        }
    }
}
