using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TypeLite;

namespace Maiter.Shared.Security
{
    
    public class CustomClaimNames
    {
        public static string UserId { get { return ClaimTypes.NameIdentifier; } }
    }

}