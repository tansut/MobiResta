using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Maiter.Core.Db;
using Maiter.Web.Core;
using Maiter.Shared.Security;

namespace Maiter.Web.Controllers
{
    public class AccountController : ApiController
    {
        [HttpPost]
        public LoginResult<Identity> Login([FromBody]Credential credentials)
        {
            return new LoginResult<Identity>()
            {
                Identity = new Identity()
                {
                    ID = credentials.ID,
                    Title = "Tansu"
                },
                Roles = new string[] { "Customer", "Admin" }
            };
        }
    }
}
